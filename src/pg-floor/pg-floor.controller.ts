import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { PgFloorService } from './pg-floor.service';
import { CreatePgFloorDto, UpdatePgFloorDto } from './dto/pg-floor.dto';

import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '../common/enums/role.enum';
import { AuthGuard } from 'src/common/guards/auth.guard';

@ApiTags('PG Floor')
@Controller('pg-floor')
export class PgFloorController {
  constructor(private readonly pgFloorService: PgFloorService) { }

  // ---------------- CREATE ----------------
  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard, new RolesGuard([Role.ADMIN]))
  @ApiOperation({ summary: 'Create a new floor (ADMIN)' })
  @ApiResponse({ status: 201, description: 'Floor successfully created.' })
  create(@Body() dto: CreatePgFloorDto) {
    return this.pgFloorService.create(dto);
  }

  // ---------------- GET ALL ----------------
  @Get()
  @ApiOperation({ summary: 'Get all floors' })
  @ApiResponse({ status: 200, description: 'Return all floors.' })
  findAll() {
    return this.pgFloorService.findAll();
  }

  // ---------------- GET ONE ----------------
  @Get(':id')
  @ApiOperation({ summary: 'Get a floor by ID' })
  @ApiParam({ name: 'id', description: 'Floor ID' })
  @ApiResponse({ status: 200, description: 'Return the floor.' })
  @ApiResponse({ status: 404, description: 'Floor not found.' })
  findOne(@Param('id') id: string) {
    return this.pgFloorService.findOne(id);
  }

  // ---------------- UPDATE ----------------
  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, new RolesGuard([Role.ADMIN]))
  @ApiOperation({ summary: 'Update a floor (ADMIN)' })
  @ApiParam({ name: 'id', description: 'Floor ID' })
  @ApiResponse({ status: 200, description: 'Floor successfully updated.' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePgFloorDto,
  ) {
    return this.pgFloorService.update(id, dto);
  }

  // ---------------- DELETE ----------------
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, new RolesGuard([Role.ADMIN]))
  @ApiOperation({ summary: 'Delete a floor (ADMIN)' })
  @ApiResponse({ status: 200, description: 'Floor successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.pgFloorService.remove(id);
  }
}
