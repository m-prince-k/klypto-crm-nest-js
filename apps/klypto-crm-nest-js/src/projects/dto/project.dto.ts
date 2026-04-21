import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Website Redesign' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Refactoring the main customer portal with React 19',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'Active', enum: ['Active', 'Completed'] })
  @IsEnum(['Active', 'Completed'])
  @IsOptional()
  status?: string;

  @ApiProperty({ example: 'user-clx...id', required: false })
  @IsString()
  @IsOptional()
  managerId?: string;
}

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}

export class CreateProjectTaskDto {
  @ApiProperty({ example: 'Fix Layout Issues' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Fix the mobile responsive layout for the checkout page',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'Medium',
    enum: ['Low', 'Medium', 'High', 'Critical'],
  })
  @IsEnum(['Low', 'Medium', 'High', 'Critical'])
  @IsOptional()
  priority?: string;

  @ApiProperty({
    example: 'todo',
    enum: ['todo', 'inprogress', 'review', 'done'],
  })
  @IsEnum(['todo', 'inprogress', 'review', 'done'])
  @IsOptional()
  status?: string;

  @ApiProperty({ example: '2026-05-15T00:00:00Z' })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiProperty({ example: 'user-clx...id', required: false })
  @IsString()
  @IsOptional()
  assigneeId?: string;

  @ApiProperty({ example: 'project-clx...id', required: false })
  @IsString()
  @IsOptional()
  projectId?: string;
}

export class UpdateProjectTaskDto extends PartialType(CreateProjectTaskDto) {}
