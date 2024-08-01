import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import * as FormData from 'form-data';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}
  private readonly logger = new Logger(ChatService.name);

  async generateProblem(userId: string) {
    const user = await this.prismaService.users.findUnique({
      where: { id: userId },
    });
    const cur = new Date();
    const birth = new Date(user.birth);
    const month = Math.abs(
      (cur.getFullYear() - birth.getFullYear()) * 12 +
        (cur.getMonth() - birth.getMonth()),
    );

    const solveHistories = await this.prismaService.solveHistories.findMany({
      where: { userId: user.id },
    });

    const correct = solveHistories.reduce(
      (acc, cur) => (cur.isCorrect ? acc + 1 : acc),
      0,
    );

    const total = solveHistories.length;

    const answerRate = total === 0 ? 0 : correct / total;

    // check and create achievement
    await this.checkAndCreateAchievement(user.id, answerRate);

    // TODO: 기준표 보고 languageLevel 계산하기
    const languageLevel = '초급';

    // TODO: feedback 불러오기
    const parentFeedback = this.prismaService.parentFeedbacks.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: { feedback: true, createdAt: true },
    });

    const data = {
      userInfo: {
        age: month,
        accuracy: answerRate,
        interests: user.interest,
        languageLevel: languageLevel,
        languageGoals: null,
        feedback: parentFeedback,
      },
    };

    const url =
      this.configService.get<string>('AI_SERVER_URL') +
      '/chat/generate_problem';

    const response = await firstValueFrom(this.httpService.post(url, data));

    const { id, question, answer, image, image_path, whole_text } =
      response.data.data;

    await this.prismaService.problems.create({
      data: {
        id: id,
        userId: user.id,
        question: question,
        answer: answer,
        imagePath: image_path,
        wholeText: whole_text,
      },
    });

    return {
      problemId: id,
      question,
      image,
    };
  }

  async generateFeedback(
    problemId: string,
    user: any,
    voice: Express.Multer.File,
  ) {
    const problem = await this.prismaService.problems.findUnique({
      where: { id: problemId, userId: user.id },
      select: { answer: true },
    });

    if (!problem) {
      throw new Error('Problem not found');
    }

    const form = new FormData();
    form.append('problemId', problemId);
    form.append('answer', JSON.stringify(problem.answer));
    form.append('voice', voice.buffer, voice.originalname);

    const headers = {
      ...form.getHeaders(),
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          this.configService.get<string>('AI_SERVER_URL') +
            '/chat/generate_feedback',
          form,
          { headers },
        ),
      );

      this.prismaService.solveHistories.create({
        data: {
          userId: user.id,
          problemId: problemId,
          isCorrect: response.data?.data.is_correct,
          feedback: response.data?.data.feedback,
          voicePath: response.data?.data.voice_path,
        },
      });

      this.checkProgress(user.id, response.data?.data.is_correct);

      return response.data.data;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /*
  checks and creates an achievement if the user is eligible
  criteria:
    1. achieved new highest answer rate (delete the old answer rate achievement)
  */
  private async checkAndCreateAchievement(
    userId: string,
    newAnswerRate: number,
  ) {
    const highestAchievement =
      await this.prismaService.userAchievements.findFirst({
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

    if (
      highestAchievement &&
      newAnswerRate > highestAchievement.achievement.level
    ) {
      await this.prismaService.userAchievements.deleteMany({
        where: {
          userId,
          achievementId: highestAchievement.achievement.id,
        },
      });
      await this.prismaService.achievements.delete({
        where: {
          id: highestAchievement.achievement.id,
        },
      });
    }

    if (
      !highestAchievement ||
      newAnswerRate > highestAchievement.achievement.level
    ) {
      const newAchievement = await this.prismaService.achievements.create({
        data: {
          title: 'Highest Answer Rate',
          description: `Achieved the highest answer rate of ${(newAnswerRate * 100).toFixed(2)}%`,
          level: newAnswerRate,
        },
      });

      await this.prismaService.userAchievements.create({
        data: {
          userId,
          achievementId: newAchievement.id,
        },
      });

      this.logger.log(
        `New achievement created for user ${userId}: ${newAchievement.title}`,
      );
    }
  }

  private async checkProgress(userId: string, isCorrect: boolean) {
    const user = await this.prismaService.users.findUnique({
      where: { id: userId },
    });

    const prog = await this.prismaService.progresses.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    if (!prog) {
      return;
    }

    const cur = new Date();
    // TODO: 오늘 만들어진 progress가 있는지 확인
    if (
      prog.createdAt.getDate() === cur.getDate() &&
      prog.createdAt.getMonth() === cur.getMonth() &&
      prog.createdAt.getFullYear() === cur.getFullYear()
    ) {
      return await this.prismaService.progresses.update({
        where: { id: prog.id },
        data: {
          correct: isCorrect ? prog.correct + 1 : prog.correct,
          total: prog.total + 1,
        },
      });
    }

    const solveHistories = await this.prismaService.solveHistories.findMany({
      where: { userId: user.id },
    });

    const correct = solveHistories.reduce(
      (acc, cur) => (cur.isCorrect ? acc + 1 : acc),
      0,
    );

    const total = solveHistories.length;

    await this.prismaService.progresses.create({
      data: {
        userId: user.id,
        correct,
        total,
      },
    });

    // check and create achievement
  }
}
