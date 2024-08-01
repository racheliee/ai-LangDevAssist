import { Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { Request } from 'express';
import { Users } from '@prisma/client';
import { JwtPayload } from 'src/auth/auth.service';
import { ConfigService } from '@nestjs/config';
declare const JwtRefreshStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtRefreshStrategy extends JwtRefreshStrategy_base {
    private readonly userService;
    private readonly configService;
    constructor(userService: UsersService, configService: ConfigService);
    validate(req: Request, payload: JwtPayload): Promise<Users>;
}
export {};
