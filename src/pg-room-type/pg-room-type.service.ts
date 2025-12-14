import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePgRoomTypeDto } from './dto/create-pg-room-type.dto';
import { UpdatePgRoomTypeDto } from './dto/update-pg-room-type.dto';

@Injectable()
export class PgRoomTypeService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreatePgRoomTypeDto) {
    // Prevent duplicate room types
    const exists = await this.prisma.roomType.findUnique({
      where: { name: dto.name.toUpperCase() },
    });
    if (exists) {
      throw new BadRequestException('Room type already exists');
    }

    return this.prisma.roomType.create({
      data: {
        name: dto.name.toUpperCase(),
        bedsCount: dto.bedsCount,
        pricePerBed: dto.pricePerBed,
      },
    });
  }

  async findAll() {
    const allRoomTypes = await this.prisma.roomType.findMany();
    if (!allRoomTypes) throw new NotFoundException('No room types found');
    return {
      data: allRoomTypes,
      message: 'Room types fetched successfully',
    };
  }

  findOne(id: string) {
    return this.prisma.roomType.findUnique({
      where: { id },
      include: { rooms: true },
    });
  }

  async update(id: string, dto: UpdatePgRoomTypeDto) {
    const roomType = await this.prisma.roomType.findUnique({ where: { id } });
    if (!roomType) {
      throw new BadRequestException('Room type not found');
    }

    return this.prisma.roomType.update({
      where: { id },
      data: {
        name: dto.name,
        bedsCount: dto.bedsCount,
        pricePerBed: dto.pricePerBed,
      },
    });
  }

  async remove(id: string) {
    const roomType = await this.prisma.roomType.findUnique({
      where: { id },
      include: { rooms: true },
    });

    if (!roomType) {
      throw new BadRequestException('Room type not found');
    }

    if (roomType.rooms.length > 0) {
      throw new BadRequestException(
        'Cannot delete room type while rooms exist',
      );
    }

    await this.prisma.roomType.delete({ where: { id } });
    return { message: 'Room type deleted successfully' };
  }
}
