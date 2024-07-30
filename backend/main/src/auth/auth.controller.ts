import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO } from './dto/sign-in.dto';
import { UsersService } from 'src/users/users.service';
import { SignUpDTO } from './dto/sign-up.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('signup')
  async signUp(@Body() signUpDTO: SignUpDTO) {
    try {
      const user = await this.usersService.create(signUpDTO);
      return {
        statusCode: 201,
        message: 'Successfully signed up',
        data: user,
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('signin')
  async signIn(
    @Body() signInDTO: SignInDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const user = await this.authService.validateUser(signInDTO);

      await this.usersService.update(user.id, { lastLogin: new Date() });
      const accessToken = await this.authService.generateAccessToken(user);
      const refreshToken = await this.authService.generateRefreshToken(user);

      await this.usersService.setCurrentRefreshToken(refreshToken, user.id);

      res.setHeader('Authorization', 'Bearer ' + [accessToken, refreshToken]);
      res.cookie('access_token', accessToken, { httpOnly: true });
      res.cookie('refresh_token', refreshToken, { httpOnly: true });

      return {
        statusCode: 200,
        message: 'Successfully signed in',
        data: { access_token: accessToken, refresh_token: refreshToken },
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('refresh')
  async refresh(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    try {
      const refreshToken = req.cookies['refresh_token'];
      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token is missing');
      }

      const { accessToken } = await this.authService.refresh(refreshToken);

      res.setHeader('Authorization', 'Bearer ' + accessToken);
      res.cookie('access_token', accessToken, { httpOnly: true });
      res.send({
        statusCode: 200,
        message: 'Successfully refreshed access token',
        data: { access_token: accessToken },
      });
    } catch (error) {
      throw error;
    }
  }

  @Post('signout')
  @UseGuards(AuthGuard('jwt-refresh-token'))
  async signOut(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    try {
      await this.usersService.removeRefreshToken(req.user.id);
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');
      return {
        statusCode: 200,
        message: 'Successfully signed out',
      };
    } catch (error) {
      throw error;
    }
  }
}
