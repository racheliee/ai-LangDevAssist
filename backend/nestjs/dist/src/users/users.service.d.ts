import { Users } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { SignUpDTO } from 'src/auth/dto/sign-up.dto';
import { SubmitTestDto } from './dto/submit-test.dto';
export declare class UsersService {
    private prisma;
    private configService;
    constructor(prisma: PrismaService, configService: ConfigService);
    create(data: SignUpDTO): Promise<{
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
    }>;
    findOne(id: string): Promise<{
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
    }>;
    findOneByLoginId(loginId: string): Promise<{
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
    }>;
    update(id: string, data: Partial<Users>): Promise<{
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
    }>;
    setCurrentRefreshToken(refreshToken: string, userId: string): Promise<{
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
    }>;
    getUserIfRefreshTokenMatches(refreshToken: string, userId: string): Promise<Users>;
    removeRefreshToken(userId: string): Promise<{
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
    }>;
    getAchievements(userId: string): Promise<{
        id: string;
        title: string;
        description: string;
        level: number | null;
        createdAt: Date;
    }[]>;
    getProgressments(userId: string): Promise<{
        id: string;
        type: import(".prisma/client").$Enums.TestType;
        userId: string;
        progress: number;
        createdAt: Date;
    }[]>;
    submitTest(userId: string, testResultData: SubmitTestDto): Promise<{
        id: string;
        userId: string;
        result: number;
        createdAt: Date;
    }>;
}
