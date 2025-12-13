import { Module } from '@nestjs/common';
import { PgBookingService } from './pg-booking.service';
import { PgBookingController } from './pg-booking.controller';

@Module({
  controllers: [PgBookingController],
  providers: [PgBookingService],
})
export class PgBookingModule {}
