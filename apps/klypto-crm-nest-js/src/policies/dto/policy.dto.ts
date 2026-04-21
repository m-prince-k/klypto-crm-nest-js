import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePolicyDto {
  @ApiProperty({ example: 'Internet Usage Policy' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Employees must use internet for business purposes...' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 'IT' })
  @IsString()
  @IsOptional()
  category?: string;
}

export class UpdatePolicyDto extends PartialType(CreatePolicyDto) {}
