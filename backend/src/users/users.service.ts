import { Injectable } from '@nestjs/common';
import { Users } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { SignUpDTO } from 'src/auth/dto/sign-up.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async create(data: SignUpDTO) {
    const saltOrRounds = parseInt(
      this.configService.get<string>('PASSWORD_SALT_ROUNDS'),
    );
    const hashedPassword = await bcrypt.hash(data.password, saltOrRounds);
    return this.prisma.users.create({
      data: { ...data, password: hashedPassword },
    });
  }

  async findOne(id: string) {
    return this.prisma.users.findUniqueOrThrow({
      where: { id },
    });
  }

  async findOneByLoginId(loginId: string) {
    return this.prisma.users.findUnique({
      where: { loginId },
    });
  }

  async update(id: string, data: Partial<Users>) {
    return this.prisma.users.update({
      where: { id },
      data,
    });
  }

  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    const saltOrRounds = 8;
    const hashedRefreshToken = await bcrypt.hash(refreshToken, saltOrRounds);
    const now = new Date();
    const refreshTokenExp = new Date(
      now.getTime() +
        parseInt(this.configService.get<string>('JWT_REFRESH_TOKEN_EXP')),
    );

    return this.prisma.users.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken, refreshTokenExp },
    });
  }

  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    userId: string,
  ): Promise<Users> {
    const user = await this.findOne(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(userId: string) {
    return this.prisma.users.update({
      where: { id: userId },
      data: { refreshToken: null, refreshTokenExp: null },
    });
  }
}
