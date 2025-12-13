import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePgBookingDto } from './dto/create-pg-booking.dto';
import { UpdatePgBookingDto } from './dto/update-pg-booking.dto';

@Injectable()
export class PgBookingService {
  constructor(private readonly prisma: PrismaService) {}

async create(dto: CreatePgBookingDto) {
  const { userId, bedId, startDate } = dto;

  const bed = await this.prisma.bed.findUnique({
    where: { id: bedId },
  });

  if (!bed || bed.isOccupied) {
    throw new BadRequestException('Bed not available');
  }

  return this.prisma.$transaction(async (tx) => {
    const booking = await tx.booking.create({
      data: {
        userId,
        bedId,
        startDate: new Date(startDate),
        status: 'ACTIVE',
      },
    });

    await tx.bed.update({
      where: { id: bedId },
      data: { isOccupied: true },
    });

    await tx.user.update({
      where: { id: userId },
      data: { isActive: true },
    });

    return booking;
  });
}


  findAll() {
    return this.prisma.booking.findMany({
      include: {
        user: true,
        bed: {
          include: {
            room: {
              include: {
                floor: true,
                roomType: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.booking.findUnique({
      where: { id },
      include: {
        user: true,
        bed: true,
      },
    });
  }

  async update(id: string, dto: UpdatePgBookingDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new BadRequestException('Booking not found');
    }

    // If booking ends or cancelled → free bed
    if (
      dto.status === 'COMPLETED'
    ) {
      await this.prisma.$transaction([
        this.prisma.booking.update({
          where: { id },
          data: { status: dto.status },
        }),
        this.prisma.bed.update({
          where: { id: booking.bedId },
          data: { isOccupied: false },
        }),
        this.prisma.user.update({
          where: { id: booking.userId },
          data: { isActive: false },
        }),
      ]);

      return { message: 'Booking updated and bed released' };
    }

    return this.prisma.booking.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new BadRequestException('Booking not found');
    }

    await this.prisma.$transaction([
      this.prisma.booking.delete({ where: { id } }),
      this.prisma.bed.update({
        where: { id: booking.bedId },
        data: { isOccupied: false },
      }),
    ]);

    return { message: 'Booking deleted successfully' };
  }

  async completeBooking(bookingId: string) {
  const booking = await this.prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking || booking.status !== 'ACTIVE') {
    throw new BadRequestException('Invalid booking');
  }

  return this.prisma.$transaction([
    this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        endDate: new Date(),
        status: 'COMPLETED',
      },
    }),
    this.prisma.bed.update({
      where: { id: booking.bedId },
      data: { isOccupied: false },
    }),
    this.prisma.user.update({
      where: { id: booking.userId },
      data: { isActive: false },
    }),
  ]);
}

}
