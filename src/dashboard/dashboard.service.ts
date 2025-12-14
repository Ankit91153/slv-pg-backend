import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DashboardService {
    constructor(private readonly prisma: PrismaService) { }

    async getStats() {
        // Get total floors
        const totalFloors = await this.prisma.floor.count();

        // Get total rooms
        const totalRooms = await this.prisma.room.count();

        // Get bed statistics
        const totalBeds = await this.prisma.bed.count();
        const occupiedBeds = await this.prisma.bed.count({
            where: { isOccupied: true },
        });
        const availableBeds = totalBeds - occupiedBeds;

        return {
            data: {
                totalFloors,
                totalRooms,
                totalBeds,
                occupiedBeds,
                availableBeds,
            },
            message: 'Dashboard statistics fetched successfully',
        };
    }
}
