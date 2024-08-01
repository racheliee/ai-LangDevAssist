import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAccessAuthGuard } from 'common/guards/jwt-access.guard';
import { SubmitTestDto } from './dto/submit-test.dto';
import { JwtPayload } from 'src/auth/auth.service';

@Controller('users')
@UseGuards(JwtAccessAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  private readonly logger: Logger;

  @Post('submitTest')
  async submitTest(@Req() req: any, @Body() submitTestDto: SubmitTestDto) {
    const { id } = req.user;

    try {
      return {
        statusCode: 200,
        message: 'Successfully submitted test',
        data: await this.usersService.submitTest(id, submitTestDto),
      };
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('Failed to submit test');
    }
  }

  @Post('submitFeedback')
  async submitFeedback(@Req() req: any, @Body() feedback: string) {
    const { id } = req.user;

    try {
      return {
        statusCode: 200,
        message: 'Successfully submitted feedback',
        data: await this.usersService.submitParentFeedback(id, feedback),
      };
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('Failed to submit feedback');
    }
  }

  @Get('achievements')
  async getAchievements(@Req() req: any) {
    const { id } = req.user;

    try {
      return {
        statusCode: 200,
        message: 'Successfully fetched user achievements',
        data: await this.usersService.getAchievements(id),
      };
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('Failed to retrieve user achievements');
    }
  }

  @Get('progressments')
  async getProgressments(@Req() req: any) {
    const { id } = req.user;

    try {
      return {
        statusCode: 200,
        message: 'Successfully fetched user progress',
        data: await this.usersService.getProgressments(id),
      };
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('Failed to retrieve user progress');
    }
  }

  // TODO: refine the response data
  @Get('me')
  async me(@Req() req: any) {
    const user: JwtPayload = req.user;
    // const retUser = {
    //   nickname: user.nickname,
    //   birth: user.birth,
    //   lastLogin: user.lastLogin,
    // };

    return {
      statusCode: 200,
      message: 'Successfully fetched user',
      // data: retUser,
      data: user,
    };
  }
}
