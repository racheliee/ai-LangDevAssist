import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAccessAuthGuard } from 'common/guards/jwt-access.guard';

@Controller('users')
@UseGuards(JwtAccessAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('submitTest')
  async submitTest(@Req() req: any) {
    const { id } = req.user;
    // TODO: use try catch to handle errors
    return this.usersService.submitTest(id);
  }

  // Implement following methods
  @Get('achievements')
  async getAchievements() {
    // return this.usersService.getAchievements();
  }

  @Get('progressments')
  async getProgressments() {
    // return this.usersService.getProgressments();
  }
}
