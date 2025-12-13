import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PgFloorModule } from './pg-floor/pg-floor.module';
import { PgRoomModule } from './pg-room/pg-room.module';
import { PgRoomTypeModule } from './pg-room-type/pg-room-type.module';
import { PgBedModule } from './pg-bed/pg-bed.module';
import { PgBookingModule } from './pg-booking/pg-booking.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      newListener: false,
      removeListener: false,
    }),
    AuthModule,
    PgFloorModule,
    PgRoomModule,
    PgRoomTypeModule,
    PgBedModule,
    PgBookingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
