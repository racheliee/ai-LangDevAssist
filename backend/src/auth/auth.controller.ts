import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO } from './dto/sign-in.dto';
import { UsersService } from 'src/users/users.service';
import { SignUpDTO } from './dto/sign-up.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAccessAuthGuard } from 'common/guards/jwt-access.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('signup')
  async signUp(@Body() signUpDTO: SignUpDTO) {
    const user = await this.usersService.create(signUpDTO);
    return {
      statusCode: 201,
      message: 'Successfully signed up',
      data: user,
    };
  }

  @Post('signin')
  async signIn(
    @Body() signInDTO: SignInDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(signInDTO);
    const accessToken = await this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken(user);

    await this.usersService.setCurrentRefreshToken(refreshToken, user.id);
    await this.usersService.update(user.id, { lastLogin: new Date() });

    res.setHeader('Authorization', 'Bearer ' + [accessToken, refreshToken]);
    res.cookie('access_token', accessToken, { httpOnly: true });
    res.cookie('refresh_token', refreshToken, { httpOnly: true });

    return {
      statusCode: 200,
      message: 'Successfully signed in',
      data: { access_token: accessToken, refresh_token: refreshToken },
    };
  }

  @Post('refresh')
  async refresh(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    try {
      const refreshToken = req.cookies['refresh_token'];
      if (!refreshToken) {
        throw new Error('No refresh token provided');
      }

      const { accessToken } = await this.authService.refresh(refreshToken);

      res.setHeader('Authorization', 'Bearer ' + accessToken);
      res.cookie('access_token', accessToken, { httpOnly: true });
      res.send({ accessToken });
    } catch (error) {
      throw error;
    }
  }

  @Post('signout')
  @UseGuards(AuthGuard('jwt-refresh-token'))
  async signOut(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    await this.usersService.removeRefreshToken(req.user.id);
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return {
      statusCode: 200,
      message: 'Successfully signed out',
    };
  }

  @Get('me')
  @UseGuards(JwtAccessAuthGuard)
  async me(@Req() req: any) {
    return {
      statusCode: 200,
      message: 'Successfully fetched user',
      data: req.user,
    };
  }
}
