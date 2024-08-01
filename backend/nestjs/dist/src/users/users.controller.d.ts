import { UsersService } from './users.service';
import { SubmitTestDto } from './dto/submit-test.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    submitTest(req: any, submitTestDto: SubmitTestDto): Promise<{
        id: string;
        userId: string;
        result: number;
        createdAt: Date;
    }>;
    getAchievements(req: any): Promise<{
        id: string;
        title: string;
        description: string;
        level: number | null;
        createdAt: Date;
    }[]>;
    getProgressments(req: any): Promise<{
        id: string;
        type: import(".prisma/client").$Enums.TestType;
        userId: string;
        progress: number;
        createdAt: Date;
    }[]>;
    me(req: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
}
