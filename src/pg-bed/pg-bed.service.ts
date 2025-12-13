import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePgBedDto } from './dto/create-pg-bed.dto';
import { UpdatePgBedDto } from './dto/update-pg-bed.dto';

@Injectable()
export class PgBedService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePgBedDto) {
    const room = await this.prisma.room.findUnique({
      where: { id: dto.roomId },
      include: {
        roomType: true,
        beds: true,
      },
    });

    if (!room) {
      throw new BadRequestException('Room not found');
    }

    // ❌ Exceeding allowed beds
    if (room.beds.length >= room.roomType.bedsCount) {
      throw new BadRequestException(
        `This room allows only ${room.roomType.bedsCount} beds`,
      );
    }

    // ❌ Invalid bed number
    if (dto.bedNumber > room.roomType.bedsCount) {
      throw new BadRequestException(
        `Bed number cannot exceed ${room.roomType.bedsCount}`,
      );
    }

    // ❌ Duplicate bed number
    const bedExists = await this.prisma.bed.findFirst({
      where: {
        roomId: dto.roomId,
        bedNumber: dto.bedNumber,
      },
    });

    if (bedExists) {
      throw new BadRequestException('Bed number already exists in this room');
    }

    return this.prisma.bed.create({
      data: {
        roomId: dto.roomId,
        bedNumber: dto.bedNumber,
        price: room.roomType.pricePerBed,
      },
    });
  }

  findAll() {
    return this.prisma.bed.findMany({
      include: {
        room: {
          include: {
            floor: true,
            roomType: true,
          },
        },
      },
      orderBy: {
        bedNumber: 'asc',
      },
    });
  }

  findOne(id: string) {
    return this.prisma.bed.findUnique({
      where: { id },
      include: {
        room: {
          include: {
            floor: true,
            roomType: true,
          },
        },
        bookings: true,
      },
    });
  }

  async update(id: string, dto: UpdatePgBedDto) {
    const bed = await this.prisma.bed.findUnique({ where: { id } });

    if (!bed) {
      throw new BadRequestException('Bed not found');
    }

    return this.prisma.bed.update({
      where: { id },
      data: {
        isOccupied: dto.isOccupied,
      },
    });
  }

  async remove(id: string) {
    const bed = await this.prisma.bed.findUnique({
      where: { id },
      include: { bookings: true },
    });

    if (!bed) {
      throw new BadRequestException('Bed not found');
    }

    if (bed.isOccupied || bed.bookings.length > 0) {
      throw new BadRequestException(
        'Cannot delete occupied or booked bed',
      );
    }

    await this.prisma.bed.delete({ where: { id } });

    return { message: 'Bed deleted successfully' };
  }
}
