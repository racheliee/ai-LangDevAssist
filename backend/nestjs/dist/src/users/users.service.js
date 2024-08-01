"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
const config_1 = require("@nestjs/config");
let UsersService = class UsersService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
    }
    async create(data) {
        const saltOrRounds = parseInt(this.configService.get('PASSWORD_SALT_ROUNDS'));
        const hashedPassword = await bcrypt.hash(data.password, saltOrRounds);
        return this.prisma.users.create({
            data: { ...data, password: hashedPassword },
        });
    }
    async findOne(id) {
        return this.prisma.users.findUniqueOrThrow({
            where: { id },
        });
    }
    async findOneByLoginId(loginId) {
        return this.prisma.users.findUnique({
            where: { loginId },
        });
    }
    async update(id, data) {
        return this.prisma.users.update({
            where: { id },
            data,
        });
    }
    async setCurrentRefreshToken(refreshToken, userId) {
        const saltOrRounds = 8;
        const hashedRefreshToken = await bcrypt.hash(refreshToken, saltOrRounds);
        const now = new Date();
        const refreshTokenExp = new Date(now.getTime() +
            parseInt(this.configService.get('JWT_REFRESH_TOKEN_EXP')));
        return this.prisma.users.update({
            where: { id: userId },
            data: { refreshToken: hashedRefreshToken, refreshTokenExp },
        });
    }
    async getUserIfRefreshTokenMatches(refreshToken, userId) {
        const user = await this.findOne(userId);
        const isRefreshTokenMatching = await bcrypt.compare(refreshToken, user.refreshToken);
        if (isRefreshTokenMatching) {
            return user;
        }
    }
    async removeRefreshToken(userId) {
        return this.prisma.users.update({
            where: { id: userId },
            data: { refreshToken: null, refreshTokenExp: null },
        });
    }
    async getAchievements(userId) {
        const userAchievements = await this.prisma.userAchievement.findMany({
            where: { id: userId },
        });
        const achievementIds = userAchievements.map((ua) => ua.achievementId);
        const achievements = await this.prisma.achievement.findMany({
            where: { id: { in: achievementIds } },
        });
        return achievements;
    }
    async getProgressments(userId) {
        return this.prisma.progress.findMany({
            where: { id: userId },
        });
    }
    async submitTest(userId, testResultData) {
        return this.prisma.testResult.create({
            data: {
                userId: userId,
                result: testResultData.result,
            },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], UsersService);
//# sourceMappingURL=users.service.js.map