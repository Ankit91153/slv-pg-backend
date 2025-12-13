import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PgBedService } from './pg-bed.service';
import { CreatePgBedDto } from './dto/create-pg-bed.dto';
import { UpdatePgBedDto } from './dto/update-pg-bed.dto';

@Controller('pg-bed')
export class PgBedController {
  constructor(private readonly pgBedService: PgBedService) {}

  @Post()
  create(@Body() dto: CreatePgBedDto) {
    return this.pgBedService.create(dto);
  }

  @Get()
  findAll() {
    return this.pgBedService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pgBedService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePgBedDto) {
    return this.pgBedService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pgBedService.remove(id);
  }
}
