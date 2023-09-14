import { Logger, Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule, loggingMiddleware } from 'nestjs-prisma';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { AuthModule } from './modules/auth/auth.module';
import { AuthSessionModule } from './modules/auth-session/auth-session.module';
@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
    AuthModule,
    UsersModule,
    AuthSessionModule,
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
