import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { SignInDTO } from './dto/sign-in.dto';
import { Users } from '@prisma/client';
export interface JwtPayload {
    id: string;
    loginId: string;
    nickname: string;
    birth: Date;
    lastLogin: Date;
}
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(signInDto: SignInDTO): Promise<Users>;
    generateAccessToken(user: Users): Promise<string>;
    generateRefreshToken(user: Users): Promise<string>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
    }>;
}
