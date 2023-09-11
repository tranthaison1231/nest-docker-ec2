import { Body, Controller, Post } from '@nestjs/common';
import { SignInDto, SignUpDto } from './dtos/auth.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authen')
@Controller()
export class AuthenticationController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-in')
  async signIn(@Body() props: SignInDto) {
    try {
      const { accessToken, refreshToken, user } =
        await this.authService.signIn(props);

      return {
        accessToken,
        refreshToken,
        user,
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('/sign-up')
  async signUp(@Body() payload: SignUpDto) {
    try {
      console.log('props', payload);

      const newUser = await this.authService.signUp(payload);

      return newUser;
    } catch (error) {
      throw error;
    }
  }
}
