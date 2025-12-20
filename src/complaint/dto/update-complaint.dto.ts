import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateComplaintDto {
    @IsString()
    @IsEnum(['PENDING', 'IN_PROGRESS', 'RESOLVED'])
    @IsOptional()
    status?: string;
}
