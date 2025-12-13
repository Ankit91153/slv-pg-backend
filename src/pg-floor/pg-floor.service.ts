import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePgFloorDto, UpdatePgFloorDto } from './dto/pg-floor.dto';

@Injectable()
export class PgFloorService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createPgFloorDto: CreatePgFloorDto) {
    const existingFloor = await this.prisma.floor.findUnique({
      where: { floorNumber: Number(createPgFloorDto?.floorNumber) },
    });

    if (existingFloor) {
      throw new BadRequestException(`Floor ${createPgFloorDto.floorNumber} already exists`);
    }

    return this.prisma.floor.create({
      data: {
        floorNumber: createPgFloorDto.floorNumber,
      },
    });
  }

  async findAll() {
    const allFloors = await this.prisma.floor.findMany();
    if (!allFloors) throw new NotFoundException('No floors found');
    return {
      data: allFloors,
      message: 'Floors fetched successfully',
    };
  }

  async findOne(id: string) {
    const floor = await this.prisma.floor.findUnique({
      where: { id },
      include: {
        rooms: {
          include: { roomType: true, beds: true },
        },
      },
    });

    if (!floor) throw new NotFoundException(`Floor with id ${id} not found`);
    return floor;
  }

  async update(id: string, updatePgFloorDto: UpdatePgFloorDto) {
    const floor = await this.prisma.floor.findUnique({ where: { id } });
    if (!floor) throw new NotFoundException(`Floor with id ${id} not found`);

    // Optional: check if new floorNumber already exists
    if (updatePgFloorDto.floorNumber) {
      const existingFloor = await this.prisma.floor.findUnique({
        where: { floorNumber: updatePgFloorDto.floorNumber },
      });
      if (existingFloor && existingFloor.id !== id) {
        throw new BadRequestException(`Floor number ${updatePgFloorDto.floorNumber} already exists`);
      }
    }

    return this.prisma.floor.update({
      where: { id },
      data: updatePgFloorDto,
    });
  }

  async remove(id: string) {
    const floor = await this.prisma.floor.findUnique({ where: { id } });
    if (!floor) throw new NotFoundException(`Floor with id ${id} not found`);

    return this.prisma.floor.delete({ where: { id } });
  }
}
