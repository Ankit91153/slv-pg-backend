import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PgRoomService } from './pg-room.service';
import { CreatePgRoomDto } from './dto/create-pg-room.dto';
import { UpdatePgRoomDto } from './dto/update-pg-room.dto';

@Controller('pg-room')
export class PgRoomController {
  constructor(private readonly pgRoomService: PgRoomService) {}

  @Post()
  create(@Body() createPgRoomDto: CreatePgRoomDto) {
    return this.pgRoomService.create(createPgRoomDto);
  }

  @Get()
  findAll() {
    return this.pgRoomService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pgRoomService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePgRoomDto: UpdatePgRoomDto) {
    return this.pgRoomService.update(id, updatePgRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pgRoomService.remove(id);
  }
}
