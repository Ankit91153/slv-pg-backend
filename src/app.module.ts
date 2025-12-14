import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
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
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { DashboardModule } from './dashboard/dashboard.module';

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
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'pg-bed', method: RequestMethod.ALL },
        { path: 'pg-booking', method: RequestMethod.ALL },
        { path: 'pg-floor', method: RequestMethod.ALL },
        { path: 'pg-room', method: RequestMethod.ALL },
        { path: 'pg-room-type', method: RequestMethod.ALL },
        { path: 'auth/logout', method: RequestMethod.POST },
      );
  }
}
