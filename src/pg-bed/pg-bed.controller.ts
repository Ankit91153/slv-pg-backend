import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PgBedService } from './pg-bed.service';
import { CreatePgBedDto } from './dto/create-pg-bed.dto';
import { UpdatePgBedDto } from './dto/update-pg-bed.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '../common/enums/role.enum';
import { AuthGuard } from '../common/guards/auth.guard';

@ApiTags('PG Bed')
@Controller('pg-bed')
export class PgBedController {
  constructor(private readonly pgBedService: PgBedService) { }

  @Post()
  @ApiBearerAuth('bearer')
  @UseGuards(AuthGuard, new RolesGuard([Role.ADMIN]))
  @ApiOperation({ summary: 'Create a new bed (ADMIN)' })
  @ApiResponse({ status: 201, description: 'Bed successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() dto: CreatePgBedDto) {
    return this.pgBedService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all beds' })
  @ApiResponse({ status: 200, description: 'Return all beds.' })
  findAll() {
    return this.pgBedService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a bed by ID' })
  @ApiParam({ name: 'id', description: 'Bed ID' })
  @ApiResponse({ status: 200, description: 'Return the bed.' })
  @ApiResponse({ status: 404, description: 'Bed not found.' })
  findOne(@Param('id') id: string) {
    return this.pgBedService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth('bearer')
  @UseGuards(AuthGuard, new RolesGuard([Role.ADMIN]))
  @ApiOperation({ summary: 'Update a bed (ADMIN)' })
  @ApiParam({ name: 'id', description: 'Bed ID' })
  @ApiResponse({ status: 200, description: 'Bed successfully updated.' })
  @ApiResponse({ status: 404, description: 'Bed not found.' })
  update(@Param('id') id: string, @Body() dto: UpdatePgBedDto) {
    return this.pgBedService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth('bearer')
  @UseGuards(AuthGuard, new RolesGuard([Role.ADMIN]))
  @ApiOperation({ summary: 'Delete a bed (ADMIN)' })
  @ApiParam({ name: 'id', description: 'Bed ID' })
  @ApiResponse({ status: 200, description: 'Bed successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Bed not found.' })
  remove(@Param('id') id: string) {
    return this.pgBedService.remove(id);
  }
}
