import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateAttendanceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  date?: string;

  @ApiProperty({ default: 'Present' })
  @IsString()
  @IsOptional()
  status: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  checkIn?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  checkOut?: string;
}

export class UpdateAttendanceDto extends PartialType(CreateAttendanceDto) {}
