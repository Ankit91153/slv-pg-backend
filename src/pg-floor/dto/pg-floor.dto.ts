import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreatePgFloorDto {
  @IsInt()
  @Min(0)
  floorNumber: number;
}

export class UpdatePgFloorDto {
  @IsInt()
  @Min(0)
  floorNumber?: number;
}
