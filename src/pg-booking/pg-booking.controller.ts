import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PgBookingService } from './pg-booking.service';
import { CreatePgBookingDto } from './dto/create-pg-booking.dto';
import { UpdatePgBookingDto } from './dto/update-pg-booking.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '../common/enums/role.enum';
import { AuthGuard } from '../common/guards/auth.guard';

@ApiTags('PG Booking')
@Controller('pg-booking')
export class PgBookingController {
  constructor(private readonly pgBookingService: PgBookingService) { }

  @Post()
  @ApiBearerAuth('bearer')
  @UseGuards(AuthGuard, new RolesGuard([Role.ADMIN]))
  @ApiOperation({ summary: 'Create a new booking (ADMIN)' })
  @ApiResponse({ status: 201, description: 'Booking successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createPgBookingDto: CreatePgBookingDto) {
    return this.pgBookingService.create(createPgBookingDto);
  }

  @Get()
  @ApiBearerAuth('bearer')
  @UseGuards(AuthGuard, new RolesGuard([Role.ADMIN]))
  @ApiOperation({ summary: 'Get all bookings (ADMIN)' })
  @ApiResponse({ status: 200, description: 'Return all bookings.' })
  findAll() {
    return this.pgBookingService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a booking by ID' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Return the booking.' })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  findOne(@Param('id') id: string) {
    return this.pgBookingService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth('bearer')
  @UseGuards(AuthGuard, new RolesGuard([Role.ADMIN]))
  @ApiOperation({ summary: 'Update a booking (ADMIN)' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Booking successfully updated.' })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  update(@Param('id') id: string, @Body() updatePgBookingDto: UpdatePgBookingDto) {
    return this.pgBookingService.update(id, updatePgBookingDto);
  }

  @Delete(':id')
  @ApiBearerAuth('bearer')
  @UseGuards(AuthGuard, new RolesGuard([Role.ADMIN]))
  @ApiOperation({ summary: 'Delete a booking (ADMIN)' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Booking successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  remove(@Param('id') id: string) {
    return this.pgBookingService.remove(id);
  }
}
