import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsDateString,
} from 'class-validator';

export class CreateFinanceDto {
  @ApiProperty({ example: 'INV-2024-001' })
  @IsString()
  @IsNotEmpty()
  referenceNumber: string;

  @ApiProperty({ example: 'INVOICE', enum: ['INVOICE', 'PURCHASE_ORDER'] })
  @IsEnum(['INVOICE', 'PURCHASE_ORDER'])
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 4200.5 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: '2024-03-25T00:00:00Z' })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiProperty({
    example: 'Pending',
    enum: ['Draft', 'Approved', 'Paid', 'Overdue', 'Fulfilled'],
  })
  @IsEnum(['Draft', 'Approved', 'Paid', 'Overdue', 'Fulfilled'])
  @IsOptional()
  status?: string;

  @ApiProperty({ example: 'clx...id' })
  @IsString()
  @IsNotEmpty()
  partnerId: string;
}

export class UpdateFinanceDto extends PartialType(CreateFinanceDto) {}
