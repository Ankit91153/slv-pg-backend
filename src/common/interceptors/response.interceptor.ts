import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>> {

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {

    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data: any) => ({
        success: true,
        code: response.statusCode ?? HttpStatus.OK,
        message: data?.message
          ? data.message
          : 'Request successful',
        data: data?.data !== undefined ? data.data : null,
      })),
    );
  }
}
