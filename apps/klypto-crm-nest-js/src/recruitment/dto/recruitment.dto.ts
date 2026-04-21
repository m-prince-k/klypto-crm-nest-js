import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsNumber,
  IsEnum,
} from 'class-validator';

export class CreateJobPostingDto {
  @ApiProperty({ example: 'Senior React Developer' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Engineering' })
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiProperty({ example: 'Build and maintain React apps.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 600000 })
  @IsNumber()
  ctcMin: number;

  @ApiProperty({ example: 1200000 })
  @IsNumber()
  ctcMax: number;

  @ApiProperty({ example: 'Full-time', enum: ['Full-time', 'Intern'] })
  @IsEnum(['Full-time', 'Intern'])
  jobType: string;

  @ApiProperty({ example: 'Bangalore, India' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ example: 'Active', enum: ['Active', 'Paused', 'Closed'] })
  @IsEnum(['Active', 'Paused', 'Closed'])
  @IsOptional()
  status?: string;
}

export class UpdateJobPostingDto extends PartialType(CreateJobPostingDto) {}

export class CreateCandidateDto {
  @ApiProperty({ example: 'Alice Smith' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'alice@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'Senior React Developer' })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty({ example: 'JOB-clx...id', required: false })
  @IsString()
  @IsOptional()
  jobId?: string;

  @ApiProperty({ example: 85, required: false })
  @IsNumber()
  @IsOptional()
  score?: number;

  @ApiProperty({
    example: 'Applied',
    enum: [
      'Applied',
      'Screening',
      'Technical',
      'Interview',
      'Offered',
      'Hired',
      'Rejected',
    ],
  })
  @IsEnum([
    'Applied',
    'Screening',
    'Technical',
    'Interview',
    'Offered',
    'Hired',
    'Rejected',
  ])
  @IsOptional()
  stage?: string;
}

export class UpdateCandidateDto extends PartialType(CreateCandidateDto) {}
