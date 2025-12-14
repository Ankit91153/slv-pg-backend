import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get('stats')
    @ApiOperation({ summary: 'Get dashboard statistics' })
    @ApiResponse({
        status: 200,
        description: 'Returns total floors, total rooms, occupied beds, and available beds.',
    })
    getStats() {
        return this.dashboardService.getStats();
    }
}
