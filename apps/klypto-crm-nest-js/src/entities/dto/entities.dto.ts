import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class CreateBranchDto {
  @ApiProperty({ example: 'HQ - San Francisco' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Main', enum: ['Main', 'Branch', 'International'] })
  @IsEnum(['Main', 'Branch', 'International'])
  @IsOptional()
  type?: string;

  @ApiProperty({ example: 'clx...id' })
  @IsString()
  @IsOptional()
  headId?: string;
}

export class UpdateBranchDto extends PartialType(CreateBranchDto) {}

export class CreateDepartmentDto {
  @ApiProperty({ example: 'Engineering' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'clx...id' })
  @IsString()
  @IsNotEmpty()
  branchId: string;

  @ApiProperty({ example: 'clx...id' })
  @IsString()
  @IsOptional()
  headId?: string;
}

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {}
