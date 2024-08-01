import {
  Body,
  Controller,
  Logger,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CartoonService } from './cartoon.service';
import { JwtAccessAuthGuard } from 'common/guards/jwt-access.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('cartoon')
@UseGuards(JwtAccessAuthGuard)
export class CartoonController {
  constructor(private readonly cartoonService: CartoonService) {}
  private readonly logger = new Logger(CartoonController.name);

  @Post('problem')
  async generateProblem(@Req() req: any) {
    const { user } = req;
    try {
      const problem = await this.cartoonService.generateProblem(user.id);
      return {
        statusCode: 200,
        message: 'Successfully generated problem',
        data: problem,
      };
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @Post('feedback')
  @UseInterceptors(FileInterceptor('voice'))
  async generateFeedback(
    @Req() req: any,
    @Body() body: { problemId: string },
    @UploadedFile() voice: Express.Multer.File,
  ) {
    const { problemId } = body;
    const { user } = req;

    try {
      const feedback = await this.cartoonService.generateFeedback(
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
      throw error;
    }
  }
}
