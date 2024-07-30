import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { SignInDTO } from './dto/sign-in.dto';
import * as bycrpt from 'bcrypt';
import { Users } from '@prisma/client';

export interface JwtPayload {
  id: string;
  loginId: string;
  nickname: string;
  birth: Date;
  lastLogin: Date;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(signInDto: SignInDTO): Promise<Users> {
    const { loginId, password } = signInDto;

    const user = await this.usersService.findOneByLoginId(loginId);
    if (!user) {
      throw new UnauthorizedException('loginId is incorrect');
    }

    // Check if the provided password is correct
    if (!(await bycrpt.compare(password, user.password))) {
      throw new UnauthorizedException('password is incorrect');
    }

    return user;
  }

  async generateAccessToken(user: Users): Promise<string> {
    const payload: JwtPayload = {
      id: user.id,
      loginId: user.loginId,
      nickname: user.nickname,
      birth: user.birth,
      lastLogin: user.lastLogin,
    };
    const accessToken = this.jwtService.signAsync(payload);

    return accessToken;
  }

  async generateRefreshToken(user: Users): Promise<string> {
    const payload = { id: user.id };

    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXP,
    });
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const { id } = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      });

      const user = await this.usersService.getUserIfRefreshTokenMatches(
        refreshToken,
        id,
      );
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const accessToken = await this.generateAccessToken(user);
      return { accessToken };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Refresh token expired');
      } else {
        throw new UnauthorizedException('Invalid refresh token');
      }
    }
  }
}
