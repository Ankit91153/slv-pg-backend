import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreatePgRoomDto {
  @IsUUID()
  @IsNotEmpty()
  floorId: string;

  @IsUUID()
  @IsNotEmpty()
  roomTypeId: string;

  @IsString()
  @IsNotEmpty()
  roomNumber: string;
}