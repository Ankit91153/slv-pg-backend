import { PartialType } from '@nestjs/swagger';
import { CreatePgRoomDto } from './create-pg-room.dto';

export class UpdatePgRoomDto extends PartialType(CreatePgRoomDto) { }
