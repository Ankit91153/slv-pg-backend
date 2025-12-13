import { Module } from '@nestjs/common';
import { PgFloorService } from './pg-floor.service';
import { PgFloorController } from './pg-floor.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [PgFloorController],
  providers: [PgFloorService, PrismaService],
})
export class PgFloorModule { }
