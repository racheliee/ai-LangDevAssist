import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ChatModule } from './chat/chat.module';
import { LoggerMiddleware } from 'common/middlewares/logger.middleware';
import { CartoonModule } from './cartoon/cartoon.module';

@Module({
  imports: [AuthModule, UsersModule, PrismaModule, ChatModule, CartoonModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
