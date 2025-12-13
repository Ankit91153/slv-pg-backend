import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PgBookingService } from './pg-booking.service';
import { CreatePgBookingDto } from './dto/create-pg-booking.dto';
import { UpdatePgBookingDto } from './dto/update-pg-booking.dto';

@Controller('pg-booking')
export class PgBookingController {
  constructor(private readonly pgBookingService: PgBookingService) {}

  @Post()
  create(@Body() createPgBookingDto: CreatePgBookingDto) {
    return this.pgBookingService.create(createPgBookingDto);
  }

  @Get()
  findAll() {
    return this.pgBookingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pgBookingService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePgBookingDto: UpdatePgBookingDto) {
    return this.pgBookingService.update(id, updatePgBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pgBookingService.remove(id);
  }
}
