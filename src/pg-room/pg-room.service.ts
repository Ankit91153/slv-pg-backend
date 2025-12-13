import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePgRoomDto } from './dto/create-pg-room.dto';
import { UpdatePgRoomDto } from './dto/update-pg-room.dto';

@Injectable()
export class PgRoomService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPgRoomDto: CreatePgRoomDto) {
    const { floorId, roomTypeId, roomNumber } = createPgRoomDto;

    // Check floor exists
    const floor = await this.prisma.floor.findUnique({ where: { id: floorId } });
    if (!floor) throw new BadRequestException('Floor not found');

    // Check room type exists
    const roomType = await this.prisma.roomType.findUnique({ where: { id: roomTypeId } });
    if (!roomType) throw new BadRequestException('Room type not found');

    // Prevent duplicate room number on same floor
    const existingRoom = await this.prisma.room.findFirst({
      where: { floorId, roomNumber },
    });
    if (existingRoom) throw new BadRequestException('Room number already exists on this floor');

    // Create room
    const room = await this.prisma.room.create({
      data: {
        floorId,
        roomTypeId,
        roomNumber,
      },
      include: {
        floor: true,
        roomType: true,
        beds: true,
      },
    });

    // Automatically create beds according to room type
    const bedsData = Array.from({ length: roomType.bedsCount }).map((_, i) => ({
      roomId: room.id,
      bedNumber: i + 1,
      price: roomType.pricePerBed,
    }));

    await this.prisma.bed.createMany({ data: bedsData });

    return await this.prisma.room.findUnique({
      where: { id: room.id },
      include: { beds: true, floor: true, roomType: true },
    });
  }

  findAll() {
    return this.prisma.room.findMany({
      include: { beds: true, floor: true, roomType: true },
      orderBy: { roomNumber: 'asc' },
    });
  }

  findOne(id: string) {
    return this.prisma.room.findUnique({
      where: { id },
      include: { beds: true, floor: true, roomType: true },
    });
  }

  async update(id: string, updatePgRoomDto: UpdatePgRoomDto) {
    const room = await this.prisma.room.findUnique({ where: { id } });
    if (!room) throw new BadRequestException('Room not found');

    // Optional: handle room number or roomType change
    if (updatePgRoomDto.roomNumber) {
      const duplicate = await this.prisma.room.findFirst({
        where: { floorId: room.floorId, roomNumber: updatePgRoomDto.roomNumber, NOT: { id } },
      });
      if (duplicate) throw new BadRequestException('Room number already exists on this floor');
    }

    return this.prisma.room.update({
      where: { id },
      data: updatePgRoomDto,
      include: { beds: true, floor: true, roomType: true },
    });
  }

  async remove(id: string) {
    const room = await this.prisma.room.findUnique({ where: { id } });
    if (!room) throw new BadRequestException('Room not found');

    // Delete all beds automatically due to cascade in schema
    await this.prisma.room.delete({ where: { id } });
    return { message: 'Room deleted successfully' };
  }
}
