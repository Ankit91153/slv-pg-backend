import { IsEnum, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum RoomTypeName {
  SINGLE = 'SINGLE',
  DOUBLE = 'DOUBLE',
  TRIPLE = 'TRIPLE',
}

export class CreatePgRoomTypeDto {
  @ApiProperty({ example: 'SINGLE', description: 'The name of the room type', enum: RoomTypeName })
  @IsEnum(RoomTypeName)
  name: RoomTypeName;

  @ApiProperty({ example: 5000, description: 'Price per bed' })
  @IsNumber()
  @Min(1)
  pricePerBed: number;
}   