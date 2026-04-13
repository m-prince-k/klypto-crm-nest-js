import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  Sse,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginDto,
  SignupDto,
  CreateUserDto,
  AuthTokensResponseDto,
  LogoutResponseDto,
  ProfileResponseDto,
  OrgExistsResponseDto,
  CreatedUserResponseDto,
} from './dto/auth.dto';
import type { Request } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthEventsService } from './auth-events.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly authEventsService: AuthEventsService,
  ) {}

  // ── Public: first-time setup check ─────────────────────────────────────────
  @Get('org-exists')
  @ApiOperation({ summary: 'Check whether an organization has been set up' })
  @ApiResponse({ status: 200, type: OrgExistsResponseDto })
  @HttpCode(HttpStatus.OK)
  orgExists(): Promise<OrgExistsResponseDto> {
    return this.authService.checkOrgExists();
  }

  // ── Public: one-time organization bootstrap ────────────────────────────────
  @Post('signup')
  @ApiOperation({
    summary: 'Bootstrap organization with first SuperAdmin account',
  })
  @ApiResponse({
    status: 201,
    description: 'Organization and SuperAdmin created',
    type: AuthTokensResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  // ── Public: employee sign-in ───────────────────────────────────────────────
  @Post('login')
  @ApiOperation({ summary: 'Sign in with email and password' })
  @ApiResponse({
    status: 200,
    description: 'Successfully signed in',
    type: AuthTokensResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // ── Protected: SuperAdmin / Admin operations ────────────────────────────────

  @Post('invite-user')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'SuperAdmin / Admin: create an employee user account',
  })
  @ApiResponse({ status: 201, type: CreatedUserResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden — admin only' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @HttpCode(HttpStatus.CREATED)
  inviteUser(
    @Req() req: Request & { user?: { sub?: string } },
    @Body() dto: CreateUserDto,
  ) {
    const adminId = req.user?.sub;
    if (!adminId) throw new UnauthorizedException('Invalid user context');
    return this.authService.createUser(adminId, dto);
  }

  @Get('users')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'SuperAdmin / Admin: list all users in the organization',
  })
  @ApiResponse({ status: 200, description: 'User list returned' })
  @HttpCode(HttpStatus.OK)
  listUsers(@Req() req: Request & { user?: { sub?: string } }) {
    const adminId = req.user?.sub;
    if (!adminId) throw new UnauthorizedException('Invalid user context');
    return this.authService.listOrgUsers(adminId);
  }

  @Patch('users/:id/toggle-status')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'SuperAdmin / Admin: toggle a user active/inactive',
  })
  @ApiResponse({ status: 200, description: 'Status toggled' })
  @HttpCode(HttpStatus.OK)
  toggleUserStatus(
    @Req() req: Request & { user?: { sub?: string } },
    @Param('id') targetId: string,
  ) {
    const adminId = req.user?.sub;
    if (!adminId) throw new UnauthorizedException('Invalid user context');
    return this.authService.toggleUserStatus(adminId, targetId);
  }

  // ── Standard protected endpoints ──────────────────────────────────────────

  @Post('logout')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Logout and invalidate refresh token' })
  @ApiResponse({ status: 200, type: LogoutResponseDto })
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: Request & { user?: { sub?: string } }) {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException('Invalid user context');
    return this.authService.logout(userId);
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({ status: 200, type: AuthTokensResponseDto })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @HttpCode(HttpStatus.OK)
  refresh(
    @Req() req: Request & { user?: { sub?: string; refreshToken?: string } },
  ) {
    const userId = req.user?.sub;
    const refreshToken = req.user?.refreshToken;
    if (!userId || !refreshToken)
      throw new UnauthorizedException('Invalid user context');
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Get('me')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get authenticated user profile' })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  me(@Req() req: Request & { user?: { sub?: string } }) {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException('Invalid user context');
    return this.authService.getProfile(userId);
  }

  @Sse('events')
  @ApiOperation({
    summary:
      'SSE stream for authenticated session events (deactivation/activation)',
  })
  async events(@Req() req: Request) {
    const token =
      typeof req.query?.token === 'string' ? String(req.query.token) : '';
    if (!token) {
      throw new UnauthorizedException('Missing access token');
    }

    let payload: { sub?: string };
    try {
      payload = this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_SECRET || 'access-secret',
      }) as { sub?: string };
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }

    if (!payload?.sub) {
      throw new UnauthorizedException('Invalid access token');
    }

    const user = await this.usersService.findActiveStatusById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    return this.authEventsService.createUserEventStream(payload.sub);
  }
}
