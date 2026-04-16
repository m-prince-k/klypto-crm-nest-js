import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the employee',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'EMP-001', description: 'Unique employee code' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ example: 'HR Manager', description: 'Role or job title' })
  @IsNotEmpty()
  @IsString()
  role: string;

  @ApiProperty({ example: 'People Ops', description: 'Department name' })
  @IsNotEmpty()
  @IsString()
  department: string;

  @ApiProperty({
    example: 'clxyz...',
    description: 'Department entity ID for hierarchy mapping',
    required: false,
  })
  @IsOptional()
  @IsString()
  departmentId?: string;

  @ApiProperty({
    example: 'clxyz...',
    description: 'Branch entity ID for hierarchy mapping',
    required: false,
  })
  @IsOptional()
  @IsString()
  branchId?: string;

  @ApiProperty({
    example: 'Active',
    description: 'Status of the employee (e.g. Active, Onboarding, Inactive)',
    required: false,
    default: 'Active',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    example: 'clxyz...',
    description: 'ID of the system user if employee has an account',
    required: false,
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ example: 'clxyz...', description: 'Organization ID' })
  @IsOptional()
  @IsString()
  organizationId?: string; // Internally assigned based on user token
}

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}

export class EmployeeResponseDto {
  @ApiProperty({ example: 'clxyz...' })
  id: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'EMP-001' })
  code: string;

  @ApiProperty({ example: 'HR Manager' })
  role: string;

  @ApiProperty({ example: 'People Ops' })
  department: string;

  @ApiProperty({ example: 'clxyz...', required: false })
  departmentId?: string;

  @ApiProperty({ example: 'clxyz...', required: false })
  branchId?: string;

  @ApiProperty({ example: 'Active' })
  status: string;

  @ApiProperty({ example: 'clxyz...' })
  organizationId: string;

  @ApiProperty({ example: '2026-04-10T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-04-10T00:00:00.000Z' })
  updatedAt: Date;
}
