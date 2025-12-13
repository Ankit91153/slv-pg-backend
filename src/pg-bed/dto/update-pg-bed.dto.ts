import { PartialType } from '@nestjs/mapped-types';
import { CreatePgBedDto } from './create-pg-bed.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePgBedDto extends PartialType(CreatePgBedDto) {
  @IsOptional()
  @IsBoolean()
  isOccupied?: boolean;
}