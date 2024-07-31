import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import * as FormData from 'form-data';
import { Express } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { GeneratedFeedbackDTO } from './dto/feedback.dto';
import { Problems, Users } from '@prisma/client';
import { GeneratedProblemDTO } from './dto/problem.dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  async generateProblem(user: Users) {
    try {
      const cur = new Date();
      const birth = new Date(user.birth);
      const month = Math.abs(
        (cur.getFullYear() - birth.getFullYear()) * 12 +
          (cur.getMonth() - birth.getMonth()),
      );

      const problems: Problems[] = await this.prismaService.problems.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });

      const answerRate =
        problems.reduce((acc, cur) => acc + (cur.isCorrect ? 1 : 0), 0) /
        problems.length;

      // TODO: 기준표 보고 languageLevel 계산하기
      const languageLevel = '초급';

      // TODO: feedback 불러오기
      const parentFeedback = '';

      const userInfo = {
        age: month,
        accuracy: answerRate,
        interests: user.interest,
        languageLevel: languageLevel,
        languageGoals: null,
        feedback: parentFeedback,
      };

      const url =
        this.configService.get<string>('AI_SERVER_URL') + '/generate_problem';
      console.log('Sending request to AI server');
      console.log(url);
      const response: { data: GeneratedProblemDTO } = await firstValueFrom(
        this.httpService.post(url, {
          userInfo: userInfo,
        }),
      );

      const { id, question, answer, image, image_path, whole_text } =
        response.data;

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
        question,
        image,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
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
      console.log('Sending request to AI server');
      const response: { data: GeneratedFeedbackDTO } = await firstValueFrom(
        this.httpService.post(
          this.configService.get<string>('AI_SERVER_URL') +
            '/generate_feedback',
          form,
          { headers },
        ),
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
