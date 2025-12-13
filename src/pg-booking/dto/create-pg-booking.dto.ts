import { IsUUID, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePgBookingDto {
  @ApiProperty({ example: 'user-uuid', description: 'The ID of the user' })
  @IsUUID()
  userId: string;

  @ApiProperty({ example: 'bed-uuid', description: 'The ID of the bed' })
  @IsUUID()
  bedId: string;

  @ApiProperty({ example: '2023-10-01', description: 'Start date of the booking' })
  @IsDateString()
  startDate: string;
}
