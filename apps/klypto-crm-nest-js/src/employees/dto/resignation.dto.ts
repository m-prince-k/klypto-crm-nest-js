import { IsString, IsInt, IsOptional, IsDateString, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ResignationStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  WITHDRAWN = 'Withdrawn',
}

export enum FNFStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  SETTLED = 'Settled',
}

export class CreateResignationDto {
  @ApiProperty({ example: '2026-05-24T10:00:00Z', description: 'Proposed last working day' })
  @IsDateString()
  proposedLastWorkingDay: string;

  @ApiPropertyOptional({ example: 30, description: 'Notice period in days' })
  @IsInt()
  @IsOptional()
  noticePeriod?: number = 30;

  @ApiProperty({ example: 'Found a better opportunity', description: 'Reason for resignation' })
  @IsString()
  reason: string;

  @ApiPropertyOptional({ example: 'Handed over all projects to John', description: 'Handover plan' })
  @IsString()
  @IsOptional()
  handoverPlan?: string;

  @ApiPropertyOptional({ example: false, description: 'Whether company assets were handed over' })
  @IsBoolean()
  @IsOptional()
  companyAssetsHandover?: boolean = false;

  @ApiProperty({ example: 'cuid_employee_id', description: 'Employee ID' })
  @IsString()
  employeeId: string;
}

export class UpdateResignationStatusDto {
  @ApiProperty({ enum: ResignationStatus, example: ResignationStatus.APPROVED })
  @IsEnum(ResignationStatus)
  @IsOptional()
  status?: ResignationStatus;

  @ApiPropertyOptional({ enum: FNFStatus, example: FNFStatus.IN_PROGRESS })
  @IsEnum(FNFStatus)
  @IsOptional()
  fnfStatus?: FNFStatus;

  @ApiPropertyOptional({ example: true, description: 'Whether company assets were handed over' })
  @IsBoolean()
  @IsOptional()
  companyAssetsHandover?: boolean;
}
