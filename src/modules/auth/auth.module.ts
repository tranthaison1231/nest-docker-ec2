import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthenticationController } from './auth.controller';

@Module({
  imports: [UsersModule],
  controllers: [AuthenticationController],
  providers: [AuthService],
})
export class AuthModule {}
