import { Module } from '@nestjs/common';
import { PgBookingService } from './pg-booking.service';
import { PgBookingController } from './pg-booking.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [PgBookingController],
  providers: [PgBookingService, PrismaService],
})
export class PgBookingModule { }
