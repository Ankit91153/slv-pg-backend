import { Module } from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { ComplaintController } from './complaint.controller';
import { PrismaService } from '../prisma.service';

@Module({
    controllers: [ComplaintController],
    providers: [ComplaintService, PrismaService],
})
export class ComplaintModule { }
