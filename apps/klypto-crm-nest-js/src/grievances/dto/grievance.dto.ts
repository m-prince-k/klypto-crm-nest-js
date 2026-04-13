import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsEnum } from 'class-validator';

export class CreateGrievanceDto {
  @ApiProperty({ example: 'Unfair treatment in project allocation' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ example: 'Ethics' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 'I have been consistently denied opportunities for high-impact projects despite performance.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'Medium', enum: ['Low', 'Medium', 'High', 'Critical'] })
  @IsEnum(['Low', 'Medium', 'High', 'Critical'])
  @IsOptional()
  severity?: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  isAnonymous?: boolean;

  @ApiProperty({ example: 'clx...id', required: false })
  @IsString()
  @IsOptional()
  employeeId?: string;
}

export class UpdateGrievanceDto extends PartialType(CreateGrievanceDto) {
  @ApiProperty({ example: 'In Review', enum: ['Open', 'In Review', 'Escalated', 'Resolved'] })
  @IsEnum(['Open', 'In Review', 'Escalated', 'Resolved'])
  @IsOptional()
  status?: string;
}
