import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class CreateLeaveDto {
  @ApiProperty({ example: 'Annual' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: '2026-04-11T00:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ example: '2026-04-13T00:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({ example: 'Family vacation' })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiProperty({ example: 'clx...employeeId' })
  @IsString()
  @IsNotEmpty()
  employeeId: string;
}

export class UpdateLeaveStatusDto {
  @ApiProperty({ enum: ['Pending', 'Approved', 'Rejected'] })
  @IsEnum(['Pending', 'Approved', 'Rejected'])
  @IsNotEmpty()
  status: string;
}

export class UpdateLeaveDto extends PartialType(CreateLeaveDto) {}
