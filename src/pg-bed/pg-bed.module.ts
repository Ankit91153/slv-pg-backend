import { Module } from '@nestjs/common';
import { PgBedService } from './pg-bed.service';
import { PgBedController } from './pg-bed.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [PgBedController],
  providers: [PgBedService, PrismaService],
})
export class PgBedModule { }
