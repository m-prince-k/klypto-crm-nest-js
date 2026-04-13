import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class UpdateOrganizationDto {
  @ApiProperty({ example: 'Nexus Global Corp' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'REG-2024-98765' })
  @IsString()
  @IsOptional()
  registrationNumber?: string;

  @ApiProperty({ example: 'www.nexusglobal.com' })
  @IsString()
  @IsOptional()
  website?: string;

  @ApiProperty({ example: 'admin@nexusglobal.com' })
  @IsEmail()
  @IsOptional()
  primaryEmail?: string;

  @ApiProperty({ example: '+1 (555) 123-4567' })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({ example: '27AAAAA0000A1Z5' })
  @IsString()
  @IsOptional()
  taxId?: string;

  @ApiProperty({ example: '123 Tech Avenue, San Francisco, CA' })
  @IsString()
  @IsOptional()
  address?: string;
}
