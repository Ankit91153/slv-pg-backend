import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePgFloorDto {
  @ApiProperty({ example: 1, description: 'The floor number' })
  @IsInt()
  @Min(0)
  floorNumber: number;
}

export class UpdatePgFloorDto {
  @ApiPropertyOptional({ example: 1, description: 'The floor number' })
  @IsInt()
  @Min(0)
  floorNumber?: number;
}
