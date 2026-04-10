import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginDto,
  SignupDto,
  AuthTokensResponseDto,
  LogoutResponseDto,
  ProfileResponseDto,
} from './dto/auth.dto';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: AuthTokensResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Email already exists' })
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in',
    type: AuthTokensResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Logout and invalidate refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged out',
    type: LogoutResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: Request & { user?: { sub?: string } }) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('Invalid user context');
    }
    return this.authService.logout(userId);
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Tokens successfully refreshed',
    type: AuthTokensResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @HttpCode(HttpStatus.OK)
  refresh(
    @Req() req: Request & { user?: { sub?: string; refreshToken?: string } },
  ) {
    const userId = req.user?.sub;
    const refreshToken = req.user?.refreshToken;
    if (!userId || !refreshToken) {
      throw new UnauthorizedException('Invalid user context');
    }
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Get('me')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get authenticated user profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile fetched successfully',
    type: ProfileResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  me(@Req() req: Request & { user?: { sub?: string } }) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('Invalid user context');
    }
    return this.authService.getProfile(userId);
  }
}
