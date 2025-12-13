import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePgBedDto {
  @ApiProperty({ example: 'room-uuid', description: 'The ID of the room' })
  @IsUUID()
  roomId: string;

  @ApiProperty({ example: 1, description: 'The bed number' })
  @IsNumber()
  @Min(1)
  bedNumber: number;
}
