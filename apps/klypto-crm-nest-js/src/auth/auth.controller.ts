import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthTokensResponseDto,
  LoginDto,
  LogoutResponseDto,
  ProfileResponseDto,
  SignupDto,
} from './dto/auth.dto';
import { Request } from 'express';
import {
  ApiBody,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
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
  @ApiBody({ type: SignupDto })
  @ApiCreatedResponse({
    description: 'User successfully created',
    type: AuthTokensResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: 'Successfully logged in',
    type: AuthTokensResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Logout and invalidate refresh token' })
  @ApiOkResponse({
    description: 'Successfully logged out',
    type: LogoutResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: any) {
    const userId = req.user?.sub;
    return this.authService.logout(userId);
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiOkResponse({
    description: 'Tokens successfully refreshed',
    type: AuthTokensResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Access denied' })
  @HttpCode(HttpStatus.OK)
  refresh(@Req() req: any) {
    const userId = req.user?.sub;
    const refreshToken = req.user?.refreshToken;
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Get('me')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiOkResponse({
    description: 'Current user profile returned',
    type: ProfileResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  me(@Req() req: Request & { user?: { sub?: string } }) {
    const userId = req.user?.sub;
    return this.authService.getProfile(userId);
  }
}
