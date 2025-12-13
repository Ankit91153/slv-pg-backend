import { Module } from '@nestjs/common';
import { PgFloorService } from './pg-floor.service';
import { PgFloorController } from './pg-floor.controller';

@Module({
  controllers: [PgFloorController],
  providers: [PgFloorService],
})
export class PgFloorModule {}
