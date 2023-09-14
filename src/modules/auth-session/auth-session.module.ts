import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthSessionController } from './controller';
import { AuthSessionService } from './auth-session.service';

@Module({
  imports: [UsersModule],
  controllers: [AuthSessionController],
  providers: [AuthSessionService],
})
export class AuthSessionModule {}
