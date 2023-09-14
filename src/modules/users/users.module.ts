import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
// import { AuthenticationMiddleware } from 'src/middlewares/authMiddleware';
import { AuthenticationSessionMiddleware } from 'src/middlewares/authSessionMiddleware';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationSessionMiddleware).forRoutes('/users');
  }
}
