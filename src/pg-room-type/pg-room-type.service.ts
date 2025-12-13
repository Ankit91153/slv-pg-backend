import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePgRoomTypeDto, RoomTypeName } from './dto/create-pg-room-type.dto';
import { UpdatePgRoomTypeDto } from './dto/update-pg-room-type.dto';

@Injectable()
export class PgRoomTypeService {
  constructor(private readonly prisma: PrismaService) { }

  private getBedsCount(type: RoomTypeName): number {
    switch (type) {
      case RoomTypeName.SINGLE:
        return 1;
      case RoomTypeName.DOUBLE:
        return 2;
      case RoomTypeName.TRIPLE:
        return 3;
      default:
        throw new BadRequestException('Invalid room type');
    }
  }

  async create(dto: CreatePgRoomTypeDto) {
    const bedsCount = this.getBedsCount(dto.name);

    // Prevent duplicate room types
    const exists = await this.prisma.roomType.findUnique({
      where: { name: dto.name },
    });
    if (exists) {
      throw new BadRequestException('Room type already exists');
    }

    return this.prisma.roomType.create({
      data: {
        name: dto.name,
        bedsCount,
        pricePerBed: dto.pricePerBed,
      },
    });
  }

  async findAll() {
    const allRoomTypes = await this.prisma.roomType.findMany();
    if (!allRoomTypes) throw new NotFoundException('No floors found');
    return {
      data: allRoomTypes,
      message: 'Floors fetched successfully',
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

    let bedsCount = roomType.bedsCount;

    if (dto.name) {
      bedsCount = this.getBedsCount(dto.name);
    }

    return this.prisma.roomType.update({
      where: { id },
      data: {
        name: dto.name,
        bedsCount,
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
