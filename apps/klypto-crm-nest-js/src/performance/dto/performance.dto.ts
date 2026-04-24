import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class CreatePerformanceReviewDto {
  @ApiProperty({ example: 'clx...employeeId' })
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({ example: 'Q1 2026' })
  @IsString()
  @IsNotEmpty()
  cycle: string;

  @ApiProperty({ example: 4.5 })
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'Excellent teamwork and delivery.' })
  @IsString()
  @IsOptional()
  feedback?: string;

  @ApiProperty({ example: 'Complete' })
  @IsString()
  @IsOptional()
  status?: string;
}

export class UpdatePerformanceReviewDto extends PartialType(
  CreatePerformanceReviewDto,
) {}
