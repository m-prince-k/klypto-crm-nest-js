import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsNumber,
  IsEnum,
} from 'class-validator';

export class CreateLeadDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john@example.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'Acme Corp', required: false })
  @IsString()
  @IsOptional()
  company?: string;

  @ApiProperty({ example: 'Medium', enum: ['High', 'Medium', 'Low'] })
  @IsEnum(['High', 'Medium', 'Low'])
  @IsOptional()
  priority?: string;

  @ApiProperty({
    example: 'New',
    enum: ['New', 'Discovery', 'Proposal', 'Negotiation', 'Won', 'Lost'],
  })
  @IsEnum(['New', 'Discovery', 'Proposal', 'Negotiation', 'Won', 'Lost'])
  @IsOptional()
  status?: string;

  @ApiProperty({ example: 1000, required: false })
  @IsNumber()
  @IsOptional()
  value?: number;

  @ApiProperty({ example: 'clx...userId', required: false })
  @IsString()
  @IsOptional()
  assigneeId?: string;
}

export class UpdateLeadDto extends PartialType(CreateLeadDto) {}

export class CreateLeadNoteDto {
  @ApiProperty({ example: 'Spoke with the client, they are interested.' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
