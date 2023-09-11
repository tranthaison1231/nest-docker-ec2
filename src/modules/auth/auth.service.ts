import {
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

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private readonly userService: UsersService,
  ) {}

  async signIn({ email, password }: SignInDto) {
    try {
      const foundUser = await this.userService.getUserByEmail(email);

      if (!foundUser) {
        throw new NotFoundException('User not found');
      }

      const hashedPassword = await hashPassword(password);

      if (foundUser.password === hashedPassword) {
        const accessToken = generateAccessToken(foundUser);
        const refreshToken = generateRefreshToken();
        this.cacheService.set(foundUser.id, refreshToken, 60 * 60);

        return {
          accessToken,
          refreshToken,
          user: foundUser,
        };
      }
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

      console.log(password);

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
}
