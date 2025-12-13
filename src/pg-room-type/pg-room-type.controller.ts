import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PgRoomTypeService } from './pg-room-type.service';
import { CreatePgRoomTypeDto } from './dto/create-pg-room-type.dto';
import { UpdatePgRoomTypeDto } from './dto/update-pg-room-type.dto';

@Controller('pg-room-type')
export class PgRoomTypeController {
  constructor(private readonly pgRoomTypeService: PgRoomTypeService) {}

  @Post()
  create(@Body() dto: CreatePgRoomTypeDto) {
    return this.pgRoomTypeService.create(dto);
  }

  @Get()
  findAll() {
    return this.pgRoomTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pgRoomTypeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePgRoomTypeDto,
  ) {
    return this.pgRoomTypeService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pgRoomTypeService.remove(id);
  }
}
