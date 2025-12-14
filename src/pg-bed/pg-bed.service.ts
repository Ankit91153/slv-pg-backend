import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePgBedDto } from './dto/create-pg-bed.dto';
import { UpdatePgBedDto } from './dto/update-pg-bed.dto';

@Injectable()
export class PgBedService {
  constructor(private readonly prisma: PrismaService) { }

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

  async findAll(floorNumber?: string, roomType?: string) {
    // Build the where clause based on filters
    const where: any = {};

    // If floor number filter is provided
    if (floorNumber) {
      where.room = {
        floor: {
          floorNumber: parseInt(floorNumber),
        },
      };
    }

    // If room type filter is provided
    if (roomType) {
      where.room = {
        ...where.room,
        roomType: {
          name: roomType.toUpperCase(),
        },
      };
    }

    const allBeds = await this.prisma.bed.findMany({
      where,
      include: {
        room: {
          include: {
            floor: true,
            roomType: true,
          },
        },
      },
      orderBy: [
        { room: { floor: { floorNumber: 'asc' } } },
        { room: { roomNumber: 'asc' } },
        { bedNumber: 'asc' },
      ],
    });

    if (!allBeds || allBeds.length === 0) {
      throw new NotFoundException('No beds found');
    }

    // Map the data to include room and floor information
    const formattedBeds = allBeds.map((bed) => ({
      id: bed.id,
      bedNumber: bed.bedNumber,
      price: bed.price,
      isOccupied: bed.isOccupied,
      roomNumber: bed.room.roomNumber,
      floorNumber: bed.room.floor.floorNumber,
      roomType: bed.room.roomType.name,
      createdAt: bed.createdAt,
      updatedAt: bed.updatedAt,
    }));

    return {
      data: formattedBeds,
      message: 'Beds fetched successfully',
    };
  }

  async findAvailableBedsByRoomType(roomType?: string) {
    const where: any = {
      isOccupied: false, // Only get available beds
    };

    // Filter by room type if provided
    if (roomType) {
      where.room = {
        roomType: {
          name: roomType.toUpperCase(),
        },
      };
    }

    const availableBeds = await this.prisma.bed.findMany({
      where,
      include: {
        room: {
          include: {
            floor: true,
            roomType: true,
          },
        },
      },
      orderBy: [
        { room: { floor: { floorNumber: 'asc' } } },
        { room: { roomNumber: 'asc' } },
        { bedNumber: 'asc' },
      ],
    });

    if (!availableBeds || availableBeds.length === 0) {
      throw new NotFoundException('No available beds found');
    }

    // Map to include relevant information
    const formattedBeds = availableBeds.map((bed) => ({
      id: bed.id,
      bedNumber: bed.bedNumber,
      bedName: `Bed ${bed.bedNumber}`,
      price: bed.price,
      roomNumber: bed.room.roomNumber,
      roomName: `Room ${bed.room.roomNumber}`,
      floorNumber: bed.room.floor.floorNumber,
      roomType: bed.room.roomType.name,
      roomTypeBedsCount: bed.room.roomType.bedsCount,
    }));

    return {
      data: formattedBeds,
      message: 'Available beds fetched successfully',
    };
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
