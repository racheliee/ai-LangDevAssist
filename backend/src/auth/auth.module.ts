import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { JwtRefreshStrategy } from 'common/strategies/jwt-refresh.strategy';
import { JwtAccessAuthGuard } from 'common/guards/jwt-access.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule, UsersModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_TOKEN_EXP'),
        },
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => UsersModule),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    ConfigService,
    JwtRefreshStrategy,
    JwtAccessAuthGuard,
  ],
})
export class AuthModule {}
