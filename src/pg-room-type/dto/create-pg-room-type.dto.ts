import { IsEnum, IsNotEmpty, IsNumber, Min } from 'class-validator';

export enum RoomTypeName {
  SINGLE = 'SINGLE',
  DOUBLE = 'DOUBLE',
  TRIPLE = 'TRIPLE',
}

export class CreatePgRoomTypeDto {
  @IsEnum(RoomTypeName)
  name: RoomTypeName;

  @IsNumber()
  @Min(1)
  pricePerBed: number;
}   