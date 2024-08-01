import { AuthService } from './auth.service';
import { SignInDTO } from './dto/sign-in.dto';
import { UsersService } from 'src/users/users.service';
import { SignUpDTO } from './dto/sign-up.dto';
import { Response } from 'express';
export declare class AuthController {
    private authService;
    private usersService;
    constructor(authService: AuthService, usersService: UsersService);
    signUp(signUpDTO: SignUpDTO): Promise<{
        statusCode: number;
        message: string;
        data: {
            id: string;
            loginId: string;
            nickname: string;
            password: string;
            birth: Date;
            createdAt: Date;
            updatedAt: Date | null;
            refreshToken: string | null;
            refreshTokenExp: Date | null;
            lastLogin: Date | null;
        };
    }>;
    signIn(signInDTO: SignInDTO, res: Response): Promise<{
        statusCode: number;
        message: string;
        data: {
            access_token: string;
            refresh_token: string;
        };
    }>;
    refresh(req: any, res: Response): Promise<void>;
    signOut(req: any, res: Response): Promise<{
        statusCode: number;
        message: string;
    }>;
}
