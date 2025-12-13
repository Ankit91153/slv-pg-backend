import { PartialType } from '@nestjs/swagger';
import { CreatePgBedDto } from './create-pg-bed.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePgBedDto extends PartialType(CreatePgBedDto) {
  @ApiPropertyOptional({ example: false, description: 'Is the bed occupied?' })
  @IsOptional()
  @IsBoolean()
  isOccupied?: boolean;
}