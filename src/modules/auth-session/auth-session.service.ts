import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { generateSessionId } from 'src/shared/utils/generateToken';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { verify } from 'argon2';
import { REFRESH_TOKEN_EXPIRE_IN } from 'src/shared/constants';
import { SignInDto } from '../auth/dtos/auth.dto';

@Injectable()
export class AuthSessionService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private readonly userService: UsersService,
  ) {}

  async createSessionId(userId: string) {
    const sessionId = generateSessionId();
    this.cacheService.set(
      `sessionId-${userId}`,
      sessionId,
      REFRESH_TOKEN_EXPIRE_IN * 60 * 60, // in seconds
    );

    return sessionId;
  }

  async signIn({ email, password }: SignInDto) {
    try {
      const foundUser = await this.userService.getUserByEmail(email);

      if (!foundUser) {
        throw new NotFoundException('User not found');
      }

      const { id } = foundUser;

      const isPasswordMatch = await verify(foundUser.password, password);

      if (!isPasswordMatch) {
        throw new BadRequestException('Incorrect Password');
      }

      await this.createSessionId(id);
      return foundUser;
    } catch (error) {
      throw error.message;
    }
  }
}
