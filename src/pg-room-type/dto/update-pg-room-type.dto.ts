import { PartialType } from '@nestjs/swagger';
import { CreatePgRoomTypeDto } from './create-pg-room-type.dto';

export class UpdatePgRoomTypeDto extends PartialType(CreatePgRoomTypeDto) { }
