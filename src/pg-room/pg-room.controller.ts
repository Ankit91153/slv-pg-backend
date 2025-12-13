import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PgRoomService } from './pg-room.service';
import { CreatePgRoomDto } from './dto/create-pg-room.dto';
import { UpdatePgRoomDto } from './dto/update-pg-room.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '../common/enums/role.enum';
import { AuthGuard } from '../common/guards/auth.guard';

@ApiTags('PG Room')
@Controller('pg-room')
export class PgRoomController {
  constructor(private readonly pgRoomService: PgRoomService) { }

  @Post()
  @ApiBearerAuth('bearer')
  @UseGuards(AuthGuard, new RolesGuard([Role.ADMIN]))
  @ApiOperation({ summary: 'Create a new room (ADMIN)' })
  @ApiResponse({ status: 201, description: 'Room successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createPgRoomDto: CreatePgRoomDto) {
    return this.pgRoomService.create(createPgRoomDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all rooms' })
  @ApiResponse({ status: 200, description: 'Return all rooms.' })
  findAll() {
    return this.pgRoomService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a room by ID' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiResponse({ status: 200, description: 'Return the room.' })
  @ApiResponse({ status: 404, description: 'Room not found.' })
  findOne(@Param('id') id: string) {
    return this.pgRoomService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth('bearer')
  @UseGuards(AuthGuard, new RolesGuard([Role.ADMIN]))
  @ApiOperation({ summary: 'Update a room (ADMIN)' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiResponse({ status: 200, description: 'Room successfully updated.' })
  @ApiResponse({ status: 404, description: 'Room not found.' })
  update(@Param('id') id: string, @Body() updatePgRoomDto: UpdatePgRoomDto) {
    return this.pgRoomService.update(id, updatePgRoomDto);
  }

  @Delete(':id')
  @ApiBearerAuth('bearer')
  @UseGuards(AuthGuard, new RolesGuard([Role.ADMIN]))
  @ApiOperation({ summary: 'Delete a room (ADMIN)' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiResponse({ status: 200, description: 'Room successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Room not found.' })
  remove(@Param('id') id: string) {
    return this.pgRoomService.remove(id);
  }
}
