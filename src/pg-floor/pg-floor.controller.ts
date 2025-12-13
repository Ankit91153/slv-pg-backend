import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PgFloorService } from './pg-floor.service';
import { CreatePgFloorDto, UpdatePgFloorDto } from './dto/pg-floor.dto';

@Controller('pg-floor')
export class PgFloorController {
  constructor(private readonly pgFloorService: PgFloorService) {}

  @Post()
  create(@Body() createPgFloorDto: CreatePgFloorDto) {
    return this.pgFloorService.create(createPgFloorDto);
  }

  @Get()
  findAll() {
    return this.pgFloorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pgFloorService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePgFloorDto: UpdatePgFloorDto) {
    return this.pgFloorService.update(id, updatePgFloorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pgFloorService.remove(id);
  }
}
