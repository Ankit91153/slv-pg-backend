import { IsUUID, IsDateString, IsOptional } from 'class-validator';

export class CreatePgBookingDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  bedId: string;

  @IsDateString()
  startDate: string;
}
