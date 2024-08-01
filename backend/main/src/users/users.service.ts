import { ConflictException, Injectable } from '@nestjs/common';
import { Users } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { SignUpDTO } from 'src/auth/dto/sign-up.dto';
import { SubmitTestDto } from './dto/submit-test.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async create(data: SignUpDTO) {
    if (await this.findOneByLoginId(data.loginId)) {
      throw new ConflictException('User already exists');
    }

    const saltOrRounds = parseInt(
      this.configService.get<string>('PASSWORD_SALT_ROUNDS'),
    );
    const hashedPassword = await bcrypt.hash(data.password, saltOrRounds);
    await this.prisma.users.create({
      data: { ...data, password: hashedPassword },
    });

    return;
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

  async getAchievements(userId: string) {
    const userAchievements = await this.prisma.userAchievements.findMany({
      where: { userId: userId },
      select: {
        achievement: {
          select: {
            title: true,
            description: true,
            level: true,
          },
        },
        createdAt: true,
      },
    });

    const achievements = userAchievements.map((ua) => {
      return {
        achievement: ua.achievement,
        createdAt: ua.createdAt,
      };
    });
    console.log(achievements);
    console.log(userAchievements);

    // const achievementIds = userAchievements.map((ua) => ua.achievementId);
    // const achievements = await this.prisma.achievements.findMany({
    //   where: { id: { in: achievementIds } },
    // });

    return achievements;
  }

  async getProgressments(userId: string) {
    const progressments = await this.prisma.progresses.findMany({
      where: { userId: userId },
      select: { type: true, progress: true, createdAt: true },
    });

    const groupedProgresses = progressments.reduce((acc, progress) => {
      const { type, ...rest } = progress;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(rest);
      return acc;
    }, {});

    return groupedProgresses;
  }

  async submitTest(userId: string, testResultData: SubmitTestDto) {
    return this.prisma.testResults.create({
      data: {
        userId: userId,
        result: testResultData.result,
      },
    });
  }

  async submitFeedback(userId: string, feedback: string) {
    return this.prisma.feedbacks.create({
      data: {
        userId: userId,
        content: feedback,
      },
    });
  }
}
