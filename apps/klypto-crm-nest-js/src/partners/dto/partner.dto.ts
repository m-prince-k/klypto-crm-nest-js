import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEmail, IsEnum, IsNumber } from 'class-validator';

export class CreatePartnerDto {
  @ApiProperty({ example: 'Global Tech Solutions' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'CUSTOMER', enum: ['CUSTOMER', 'VENDOR'] })
  @IsEnum(['CUSTOMER', 'VENDOR'])
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 'John Carter' })
  @IsString()
  @IsNotEmpty()
  contactPerson: string;

  @ApiProperty({ example: 'john@gt-solutions.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+1 415 555 0122' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'Active', enum: ['Active', 'Inactive', 'Blocked'] })
  @IsEnum(['Active', 'Inactive', 'Blocked'])
  @IsOptional()
  status?: string;

  @ApiProperty({ example: 'IT Electronics' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ example: 50000 })
  @IsNumber()
  @IsOptional()
  creditLimit?: number;
}

export class UpdatePartnerDto extends PartialType(CreatePartnerDto) {}
