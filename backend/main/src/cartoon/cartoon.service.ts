import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Users } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartoonService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}
  private readonly logger = new Logger(CartoonService.name);

  async generateProblem(userId: string) {
    return userId;
  }

  async generateFeedback(
    problemId: string,
    user: Partial<Users>,
    voice: Express.Multer.File,
  ) {
    return { problemId, user, voice };
  }
}
