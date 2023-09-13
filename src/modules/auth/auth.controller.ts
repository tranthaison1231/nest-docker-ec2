import {
  Body,
  Controller,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto, SignUpDto } from './dtos/auth.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { REFRESH_TOKEN_EXPIRE_IN } from 'src/shared/constants';
import * as jwt from 'jsonwebtoken';

@ApiTags('Authen')
@Controller()
export class AuthenticationController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-in')
  async signIn(
    @Body() props: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const { accessToken, refreshToken, user } =
        await this.authService.signIn(props);

      response.cookie('refreshToken', refreshToken, {
        maxAge: REFRESH_TOKEN_EXPIRE_IN * 60 * 1000,
        sameSite: 'none',
        httpOnly: true,
        secure: true,
        path: '/refresh-token',
      });

      return {
        accessToken,
        refreshToken,
        user,
      };
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  @Post('/sign-up')
  async signUp(@Body() payload: SignUpDto) {
    try {
      const newUser = await this.authService.signUp(payload);

      return newUser;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  @Put('/refresh-token')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const authorizationHeader = req.headers['authorization'];

    const token = authorizationHeader && authorizationHeader.split(' ')[1];
    const { id, firstName, lastName, email } = jwt.decode(token);

    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken || !id) {
      throw new UnauthorizedException('Invalid Refresh Token');
    }

    const data = await this.authService.getRefreshToken(refreshToken, {
      id,
      firstName,
      lastName,
      email,
    });

    if (!data) {
      throw new UnauthorizedException('Refresh Token Expired');
    }

    res.cookie('refreshToken', data.refreshToken, {
      maxAge: REFRESH_TOKEN_EXPIRE_IN * 60 * 1000,
      sameSite: 'none',
      httpOnly: true,
      secure: true,
      path: '/refresh-token',
    });

    return data;
  }
}
