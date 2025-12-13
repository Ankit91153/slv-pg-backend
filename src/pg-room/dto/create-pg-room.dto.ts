import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePgRoomDto {
  @ApiProperty({ example: 'floor-uuid', description: 'The ID of the floor' })
  @IsUUID()
  @IsNotEmpty()
  floorId: string;

  @ApiProperty({ example: 'room-type-uuid', description: 'The ID of the room type' })
  @IsUUID()
  @IsNotEmpty()
  roomTypeId: string;

  @ApiProperty({ example: '101', description: 'The room number' })
  @IsString()
  @IsNotEmpty()
  roomNumber: string;
}