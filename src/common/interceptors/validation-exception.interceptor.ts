import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class ValidationExceptionInterceptor implements ExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const res = exception.getResponse() as any;

        const errors = Array.isArray(res.message) ? res.message : [res.message];

        response.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Validation failed',
            errors: errors,
        });
    }
}
