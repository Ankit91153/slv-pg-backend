
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(req.headers, "HEADERS");

    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    console.log(authHeader, "AUTH");

    if (authHeader && authHeader.toString().startsWith('Bearer ')) {
      const token = authHeader.toString().split(' ')[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req['user'] = decoded;
      } catch (err) {
        throw new UnauthorizedException('Invalid or expired token');
      }
    }
    next();
  }
}
