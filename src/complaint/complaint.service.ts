import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';

@Injectable()
export class ComplaintService {
    constructor(private readonly prisma: PrismaService) { }

    async create(userId: string, createComplaintDto: CreateComplaintDto) {
        return this.prisma.complaint.create({
            data: {
                ...createComplaintDto,
                userId,
            },
        });
    }

    async findAll(userId?: string) {
        if (userId) {
            return this.prisma.complaint.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { name: true } } } // Adjust based on user model
            });
        }
        // Admin sees all
        return this.prisma.complaint.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        companyOrCollegeName: true,
                        phoneNumber: true,
                    },
                },
            },
        });
    }

    async update(id: string, updateComplaintDto: UpdateComplaintDto) {
        const complaint = await this.prisma.complaint.findUnique({ where: { id } });
        if (!complaint) {
            throw new NotFoundException('Complaint not found');
        }
        return this.prisma.complaint.update({
            where: { id },
            data: updateComplaintDto,
        });
    }
}
