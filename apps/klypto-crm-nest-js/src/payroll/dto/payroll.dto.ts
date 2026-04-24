import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class CreateSalaryStructureDto {
  @ApiProperty({ example: 'clx...employeeId' })
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({ example: 50000 })
  @IsNumber()
  @Min(0)
  basicSalary: number;

  @ApiProperty({ example: 15000 })
  @IsNumber()
  @Min(0)
  hra: number;

  @ApiProperty({ example: 5000 })
  @IsNumber()
  @Min(0)
  allowances: number;

  @ApiProperty({ example: 2000 })
  @IsNumber()
  @Min(0)
  deductions: number;
}

export class ProcessPayrollDto {
  @ApiProperty({ example: 4 })
  @IsNumber()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({ example: 2026 })
  @IsNumber()
  @Min(2024)
  year: number;
}
