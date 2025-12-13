import { Module } from '@nestjs/common';
import { PgRoomTypeService } from './pg-room-type.service';
import { PgRoomTypeController } from './pg-room-type.controller';

@Module({
  controllers: [PgRoomTypeController],
  providers: [PgRoomTypeService],
})
export class PgRoomTypeModule {}
