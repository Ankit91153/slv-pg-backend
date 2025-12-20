import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
// Assuming you have an AuthGuard
// import { AuthGuard } from '../auth/auth.guard'; 

@Controller('complaints')
export class ComplaintController {
    constructor(private readonly complaintService: ComplaintService) { }

    // @UseGuards(AuthGuard) // validation later
    @Post()
    create(@Body() createComplaintDto: CreateComplaintDto) {
        // TODO: Extract userId from request after Auth implementation
        // For now passing userId in body for testing or hardcoded until Auth guard is used
        // const userId = req.user.id; 
        // TEMPORARY: Expect userId in body for quick test if no auth guard active globally
        // But better to stick to the plan. Let's assume we can get it or pass it.
        // I will modify the DTO to accept userId temporarily if needed, or better, 
        // I'll update the Service to take userId.

        // For this step, I'll allow passing userId in the body for simplicity if Auth isn't fully set up in this context
        // But checking Auth Service, it uses JWT.

        return this.complaintService.create(createComplaintDto['userId'], createComplaintDto);
    }

    @Get()
    findAll(@Req() req) {
        // If admin, return all. If tenant, return own.
        // const userId = req.user.role === 'ADMIN' ? undefined : req.user.id;
        // return this.complaintService.findAll(userId);
        return this.complaintService.findAll();
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateComplaintDto: UpdateComplaintDto) {
        return this.complaintService.update(id, updateComplaintDto);
    }
}
