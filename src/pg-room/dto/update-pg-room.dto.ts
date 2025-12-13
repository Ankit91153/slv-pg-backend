import { PartialType } from '@nestjs/mapped-types';
import { CreatePgRoomDto } from './create-pg-room.dto';

export class UpdatePgRoomDto extends PartialType(CreatePgRoomDto) {}
