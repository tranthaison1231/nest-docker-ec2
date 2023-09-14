import {
  Body,
  Controller,
  Post,
  Session,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthSessionService } from './auth-session.service';
import { SignInDto } from '../auth/dtos/auth.dto';

@ApiTags('Authen')
@Controller()
export class AuthSessionController {
  constructor(private readonly authService: AuthSessionService) {}

  @Post('/sign-in-with-session')
  async signInWithSession(
    @Body() props: SignInDto,
    @Session() session: Record<string, any>,
  ) {
    try {
      const user = await this.authService.signIn(props);

      session.userId = user.id;

      return user;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
