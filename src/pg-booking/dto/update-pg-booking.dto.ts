import { IsOptional, IsDateString, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePgBookingDto {
  @ApiPropertyOptional({ example: '2023-12-31', description: 'End date of the booking' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ example: 'COMPLETED', description: 'Status of the booking', enum: ['ACTIVE', 'COMPLETED'] })
  @IsOptional()
  @IsString()
  status?: 'ACTIVE' | 'COMPLETED';
}
