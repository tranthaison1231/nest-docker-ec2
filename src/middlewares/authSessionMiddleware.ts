import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthenticationSessionMiddleware implements NestMiddleware {
  constructor(@Inject(CACHE_MANAGER) private cacheService: Cache) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    try {
      const sessionId = req.cookies['refreshToken'];
      const redisSessionId = this.cacheService;

      const authHeader = req.header('Authorization');
      const accessToken = authHeader && authHeader.split(' ')[1];

      if (!accessToken) {
        throw 'No token header provided!';
      }

      verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY, (err) => {
        if (err) {
          throw err.message;
        }

        next();
      });
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
