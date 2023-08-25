import { Logger, Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule, loggingMiddleware } from 'nestjs-prisma';

@Module({
  imports: [
    UsersModule,
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [
          loggingMiddleware({
            logger: new Logger('PrismaMiddleware'),
            logLevel: 'log',
          }),
        ],
      },
    }),
  ],
})
export class AppModule {}
