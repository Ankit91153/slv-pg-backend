import { PartialType } from '@nestjs/mapped-types';
import { CreatePgRoomTypeDto } from './create-pg-room-type.dto';

export class UpdatePgRoomTypeDto extends PartialType(CreatePgRoomTypeDto) {}
