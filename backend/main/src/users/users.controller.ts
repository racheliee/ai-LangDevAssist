import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAccessAuthGuard } from 'common/guards/jwt-access.guard';
import { SubmitTestDto } from './dto/submit-test.dto';

@Controller('users')
@UseGuards(JwtAccessAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
      throw new BadRequestException('Failed to submit test');
    }
  }

  // Implement following methods
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
      throw new BadRequestException('Failed to retrieve user progress');
    }
  }

  @Get('me')
  async me(@Req() req: any) {
    return {
      statusCode: 200,
      message: 'Successfully fetched user',
      data: req.user,
    };
  }
}
