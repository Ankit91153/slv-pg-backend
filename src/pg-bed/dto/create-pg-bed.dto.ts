import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class CreatePgBedDto {
  @IsUUID()
  roomId: string;

  @IsNumber()
  @Min(1)
  bedNumber: number;
}
