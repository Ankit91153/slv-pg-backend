import { Module } from '@nestjs/common';
import { PgBedService } from './pg-bed.service';
import { PgBedController } from './pg-bed.controller';

@Module({
  controllers: [PgBedController],
  providers: [PgBedService],
})
export class PgBedModule {}
