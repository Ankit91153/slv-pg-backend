import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { verifyToken } from '../utils/jwt.util';

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1] || request.headers['authorization']?.split(' ')[1];


        if (!token) {
            throw new UnauthorizedException('User not authenticated');
        }
        const decodedToken = verifyToken(token);
        request.user = decodedToken;
        return true;
    }
}
