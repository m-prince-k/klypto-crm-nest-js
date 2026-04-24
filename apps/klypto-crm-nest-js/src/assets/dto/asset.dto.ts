import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
} from 'class-validator';

export class CreateAssetDto {
  @ApiProperty({ example: 'MacBook Pro M3 Max' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'IT Electronics' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 'HQ - San Francisco' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ example: 3500 })
  @IsNumber()
  @IsOptional()
  value?: number;

  @ApiProperty({
    example: 'In Storage',
    enum: ['In Use', 'In Storage', 'Maintenance', 'Disposed'],
  })
  @IsEnum(['In Use', 'In Storage', 'Maintenance', 'Disposed'])
  @IsOptional()
  status?: string;

  @ApiProperty({ example: 'clx...id', required: false })
  @IsString()
  @IsOptional()
  employeeId?: string;
}

export class UpdateAssetDto extends PartialType(CreateAssetDto) {}
