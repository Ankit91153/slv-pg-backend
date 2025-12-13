import { Module } from '@nestjs/common';
import { PgRoomService } from './pg-room.service';
import { PgRoomController } from './pg-room.controller';

@Module({
  controllers: [PgRoomController],
  providers: [PgRoomService],
})
export class PgRoomModule {}
