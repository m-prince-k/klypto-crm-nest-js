import { IsString, IsNumber, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ReimbursementStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  REIMBURSED = 'Reimbursed',
}

export class CreateReimbursementDto {
  @ApiProperty({ example: 150.5, description: 'Amount to be reimbursed' })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'Travel expenses for client meeting', description: 'Reason for the expense' })
  @IsString()
  reason: string;

  @ApiPropertyOptional({ example: 'https://example.com/receipt.pdf', description: 'URL to the attached bill/receipt' })
  @IsString()
  @IsOptional()
  attachmentUrl?: string;

  @ApiPropertyOptional({ example: '2026-04-24T10:00:00Z', description: 'Date of the expense' })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiProperty({ example: 'cuid_employee_id', description: 'Employee ID' })
  @IsString()
  employeeId: string;
}

export class UpdateReimbursementStatusDto {
  @ApiProperty({ enum: ReimbursementStatus, example: ReimbursementStatus.APPROVED })
  @IsEnum(ReimbursementStatus)
  status: ReimbursementStatus;
}
