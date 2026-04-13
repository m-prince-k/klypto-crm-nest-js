import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export class ApprovalActionDto {
  @ApiProperty({ example: 'LEAVE', enum: ['LEAVE', 'FINANCE'] })
  @IsEnum(['LEAVE', 'FINANCE'])
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 'clx...id' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ example: 'APPROVE', enum: ['APPROVE', 'REJECT'] })
  @IsEnum(['APPROVE', 'REJECT'])
  @IsNotEmpty()
  action: string;
}
