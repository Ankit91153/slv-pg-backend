import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PgRoomTypeService } from './pg-room-type.service';
import { CreatePgRoomTypeDto } from './dto/create-pg-room-type.dto';
import { UpdatePgRoomTypeDto } from './dto/update-pg-room-type.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '../common/enums/role.enum';
import { AuthGuard } from '../common/guards/auth.guard';

@ApiTags('PG Room Type')
@Controller('pg-room-type')
export class PgRoomTypeController {
  constructor(private readonly pgRoomTypeService: PgRoomTypeService) { }

  @Post()
  @ApiBearerAuth('bearer')
  @UseGuards(AuthGuard, new RolesGuard([Role.ADMIN]))
  @ApiOperation({ summary: 'Create a new room type (ADMIN)' })
  @ApiResponse({ status: 201, description: 'Room type successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() dto: CreatePgRoomTypeDto) {
    return this.pgRoomTypeService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all room types' })
  @ApiResponse({ status: 200, description: 'Return all room types.' })
  findAll() {
    return this.pgRoomTypeService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a room type by ID' })
  @ApiParam({ name: 'id', description: 'Room Type ID' })
  @ApiResponse({ status: 200, description: 'Return the room type.' })
  @ApiResponse({ status: 404, description: 'Room type not found.' })
  findOne(@Param('id') id: string) {
    return this.pgRoomTypeService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth('bearer')
  @UseGuards(AuthGuard, new RolesGuard([Role.ADMIN]))
  @ApiOperation({ summary: 'Update a room type (ADMIN)' })
  @ApiParam({ name: 'id', description: 'Room Type ID' })
  @ApiResponse({ status: 200, description: 'Room type successfully updated.' })
  @ApiResponse({ status: 404, description: 'Room type not found.' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePgRoomTypeDto,
  ) {
    return this.pgRoomTypeService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth('bearer')
  @UseGuards(AuthGuard, new RolesGuard([Role.ADMIN]))
  @ApiOperation({ summary: 'Delete a room type (ADMIN)' })
  @ApiParam({ name: 'id', description: 'Room Type ID' })
  @ApiResponse({ status: 200, description: 'Room type successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Room type not found.' })
  remove(@Param('id') id: string) {
    return this.pgRoomTypeService.remove(id);
  }
}
