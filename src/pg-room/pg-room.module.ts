import { Module } from '@nestjs/common';
import { PgRoomService } from './pg-room.service';
import { PgRoomController } from './pg-room.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [PgRoomController],
  providers: [PgRoomService, PrismaService],
})
export class PgRoomModule { }
