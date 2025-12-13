import { IsOptional, IsDateString, IsString } from 'class-validator';

export class UpdatePgBookingDto {
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  status?: 'ACTIVE' | 'COMPLETED';
}
