import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindAllBedsQueryDto {
    @ApiPropertyOptional({
        example: '1',
        description: 'Filter by floor number'
    })
    @IsOptional()
    @IsString()
    floorNumber?: string;

    @ApiPropertyOptional({
        example: 'SINGLE',
        description: 'Filter by room type name (e.g., SINGLE, DOUBLE, TRIPLE)'
    })
    @IsOptional()
    @IsString()
    roomType?: string;
}
