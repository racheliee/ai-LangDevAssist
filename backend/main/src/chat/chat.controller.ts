import {
  Body,
  Controller,
  InternalServerErrorException,
  Logger,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAccessAuthGuard } from 'common/guards/jwt-access.guard';
import { ChatService } from './chat.service';

@Controller('chat')
@UseGuards(JwtAccessAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  private readonly logger = new Logger(ChatController.name);

  @Post('problem')
  async generateProblem(@Req() req) {
    const { user } = req;

    try {
      const problem = await this.chatService.generateProblem(user.id);
      return {
        statusCode: 200,
        message: 'Successfully generated problem',
        data: problem,
      };
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  @Post('feedback')
  @UseInterceptors(FileInterceptor('voice'))
  async sendMessage(
    @Req() req,
    @Body() body: { problemId: string },
    @UploadedFile() voice: Express.Multer.File,
  ) {
    const { problemId } = body;
    const { user } = req;

    try {
      const feedback = await this.chatService.generateFeedback(
        problemId,
        user,
        voice,
      );
      return {
        statusCode: 200,
        message: 'Successfully generated feedback',
        data: feedback,
      };
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}
