import { ConflictException, Injectable, Logger } from '@nestjs/common';
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
  ) { }
  private readonly logger = new Logger(UsersService.name);

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

  /*
    checks and creates an achievement if the user is eligible
    criteria: achieved new highest answer rate (update the old achievement's answer rate if needed)
 */
  private async checkAndCreateAnsRateAchievement(userId: string) {
    // TODO: fix
    const progressments = await this.prisma.progresses.findMany({
      where: { userId },
      select: { },
    });

    // get most recent progressment
    const mostRecentProgress = progressments[progressments.length - 1];

    const highestAnsRateAchievement =
      await this.prisma.userAchievements.findFirst({
        where: { userId },
        include: {
          achievement: true,
        },
        orderBy: {
          achievement: {
            level: 'desc',
          },
        },
      });

    // if the user already has an achievement on highest accuracy
    if (highestAnsRateAchievement) {
      // check if the new answer rate is higher than the current 
      if (newAnswerRate > highestAnsRateAchievement.achievement.level) {
        await this.prisma.achievements.update({
          where: { id: highestAnsRateAchievement.achievement.id },
          data: {
            title: `정답률 ${(newAnswerRate * 100).toFixed(2)}% 달성`,
            description: `정답률 최고기록 달성! 주어진 문제의 ${(newAnswerRate * 100).toFixed(2)}% 정답을 맞췄어요.`,
            level: newAnswerRate,
          }
        });

        this.logger.log(`Highest Answer Rate achievement updated for user ${userId} to ${newAnswerRate}`);
      }
    }
    // no highest answer rate achievement exists => create one
    else {
      const newHighAnsRateAchievement = await this.prisma.achievements.create({
        data: {
          title: `정답률 ${(newAnswerRate * 100).toFixed(2)}% 달성`,
          description: `정답률 최고기록 달성! 주어진 문제의 ${(newAnswerRate * 100).toFixed(2)}% 정답을 맞췄어요.`,
          level: newAnswerRate,
        }
      });

      await this.prisma.userAchievements.create({
        data: {
          userId: userId,
          achievementId: newHighAnsRateAchievement.id,
        },
      });

      this.logger.log(`Highest Answer Rate achievement created for user ${userId} with answer rate ${newAnswerRate}`);
    }
  }

  /*
    checks and creates an achievement if the user is eligible
    criteria: number of distinct days the user has solved problems
  */
  private async checkAndCreateDistinctDaysAchievement(userId: string) {
    const learningDays = await this.prisma.progresses.findMany({
      where: { userId },
      select: { createdAt: true },
    });

    // get number of distinct days the user has solved problems
    const distinctDays = new Set(learningDays.map(day => day.createdAt.toDateString())).size;

    const milestones = [1, 3, 5, 7, 10, 20, 30, 45, 60, 90];

    for (const milestone of milestones) { //TODO: iterate reverse
      // if the user has not reached the milestone yet, skip
      if (distinctDays < milestone) {
        break;
      }

      const existingAchievement = await this.prisma.userAchievements.findFirst({
        where: {
          userId: userId,
          achievement: {
            title: `${milestone}일 학습 완료`,
          }
        },
      })

      // if the user already has an achievement on distinct days, skip
      if (existingAchievement) {
        continue;
      }

      // create a new achievement
      const newAchievement = await this.prisma.achievements.create({
        data: {
          title: `${milestone}일 학습 완료`,
          description: `${milestone}일 연속 학습을 완료했어요! 정말 대단해요!`,
          level: milestone,
        }
      });

      await this.prisma.userAchievements.create({
        data: {
          userId: userId,
          achievementId: newAchievement.id,
        }
      });

      this.logger.log(`Distinct Days achievement created for user ${userId} with ${milestone} days`);
    }
  }

  async getAchievements(userId: string) {
    // TODO: renew achievements
    this.checkAndCreateAnsRateAchievement(userId);
    this.checkAndCreateDistinctDaysAchievement(userId);

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

  async submitParentFeedback(userId: string, feedback: string) {
    return this.prisma.parentFeedbacks.create({
      data: {
        userId: userId,
        feedback,
      },
    });
  }
}
