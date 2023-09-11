import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignInDto, SignUpDto } from './dtos/auth.dto';
import { UsersService } from '../users/users.service';
import { hashPassword } from 'src/shared/utils/password';
import {
  generateAccessToken,
  generateRefreshToken,
} from 'src/shared/utils/generateToken';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { verify } from 'argon2';
import { REFRESH_TOKEN_EXPIRE_IN } from 'src/shared/constants';
import { JWTUser } from './type';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private readonly userService: UsersService,
  ) {}

  async createToken(user: JWTUser) {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();
    this.cacheService.set(
      user.id,
      refreshToken,
      REFRESH_TOKEN_EXPIRE_IN * 60 * 60, // in seconds
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async signIn({ email, password }: SignInDto) {
    try {
      const foundUser = await this.userService.getUserByEmail(email);

      if (!foundUser) {
        throw new NotFoundException('User not found');
      }

      const { id, firstName, lastName } = foundUser;

      const isPasswordMatch = await verify(foundUser.password, password);

      if (!isPasswordMatch) {
        throw new BadRequestException('Incorrect Password');
      }

      const tokens = await this.createToken({
        id,
        firstName,
        lastName,
        email,
      });
      return {
        ...tokens,
        user: foundUser,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async signUp(props: SignUpDto) {
    const { email, password, ...rest } = props;
    try {
      const foundUser = await this.userService.getUserByEmail(email);

      if (foundUser) {
        throw new ConflictException('User email already exists');
      }

      const hashedPassword = await hashPassword(password);

      const newUser = await this.userService.createUser({
        email,
        ...rest,
        password: hashedPassword,
      });

      return newUser;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getRefreshToken(requestedRefreshToken: string, user: JWTUser) {
    const redisRefreshToken = await this.cacheService.get(user.id);

    if (redisRefreshToken === requestedRefreshToken) {
      return this.createToken(user);
    }

    return undefined;
  }
}
