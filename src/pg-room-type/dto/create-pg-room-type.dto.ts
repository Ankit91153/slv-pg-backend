import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePgRoomTypeDto {
  @ApiProperty({ example: 'Single', description: 'The name of the room type (e.g., Single, Double, Deluxe, Suite)' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 2, description: 'Number of beds in this room type' })
  @IsNumber()
  @Min(1)
  bedsCount: number;

  @ApiProperty({ example: 5000, description: 'Price per bed' })
  @IsNumber()
  @Min(1)
  pricePerBed: number;
}   