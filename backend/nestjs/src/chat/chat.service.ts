import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import * as FormData from 'form-data';
import { Express } from 'express';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

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
      const response = await firstValueFrom(
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
