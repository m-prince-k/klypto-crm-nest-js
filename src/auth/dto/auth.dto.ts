import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'The password (min 6 characters)',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The full name of the user',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    example: 'Klypto Corp',
    description: 'The name of the organization',
  })
  @IsString()
  @IsNotEmpty()
  organizationName: string;
}

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'The password of the user',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class AuthTokensResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.access-token',
    description: 'JWT access token',
  })
  accessToken: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh-token',
    description: 'JWT refresh token',
  })
  refreshToken: string;

  @ApiProperty({
    example: ['SUPER_ADMIN'],
    required: false,
    description: 'Assigned role names for the user',
  })
  roles?: string[];

  @ApiProperty({
    example: 'SUPER_ADMIN',
    required: false,
    description: 'Single assigned role at signup bootstrap',
  })
  role?: string;
}

export class LogoutResponseDto {
  @ApiProperty({
    example: 'Logged out successfully',
  })
  message: string;
}

export class UserOrganizationResponseDto {
  @ApiProperty({ example: 'clxabc123org' })
  id: string;

  @ApiProperty({ example: 'Klypto Corp' })
  name: string;
}

export class ProfileResponseDto {
  @ApiProperty({ example: 'clxabc123user' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  fullName: string;

  @ApiProperty({ type: UserOrganizationResponseDto })
  organization: UserOrganizationResponseDto;

  @ApiProperty({ example: ['SUPER_ADMIN'] })
  roles: string[];

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2026-04-09T06:30:00.000Z' })
  createdAt: string;
}
