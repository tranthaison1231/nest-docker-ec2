import {
  Body,
  Controller,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { REFRESH_TOKEN_EXPIRE_IN } from 'src/shared/constants';
import { AuthSessionService } from './auth-session.service';
import { SignInDto } from '../auth/dtos/auth.dto';

@ApiTags('Authen')
@Controller()
export class AuthSessionController {
  constructor(private readonly authService: AuthSessionService) {}

  @Post('/sign-in-with-session')
  async signInWithSession(
    @Body() props: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const { sessionId, user } = await this.authService.signIn(props);

      response.cookie('sessionId', sessionId, {
        maxAge: REFRESH_TOKEN_EXPIRE_IN * 60 * 1000,
        sameSite: 'none',
        httpOnly: true,
        secure: true,
        path: '/',
      });

      return {
        user,
      };
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
