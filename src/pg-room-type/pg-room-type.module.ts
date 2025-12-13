import { Module } from '@nestjs/common';
import { PgRoomTypeService } from './pg-room-type.service';
import { PgRoomTypeController } from './pg-room-type.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [PgRoomTypeController],
  providers: [PgRoomTypeService, PrismaService],
})
export class PgRoomTypeModule { }
