import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { verify } from 'argon2';
import { SignInDto } from '../auth/dtos/auth.dto';

@Injectable()
export class AuthSessionService {
  constructor(private readonly userService: UsersService) {}

  async signIn({ email, password }: SignInDto) {
    try {
      const foundUser = await this.userService.getUserByEmail(email);

      if (!foundUser) {
        throw new NotFoundException('User not found');
      }

      // const { id } = foundUser;

      const isPasswordMatch = await verify(foundUser.password, password);

      if (!isPasswordMatch) {
        throw new BadRequestException('Incorrect Password');
      }

      // await this.createSessionId(id);
      return foundUser;
    } catch (error) {
      throw error.message;
    }
  }
}
