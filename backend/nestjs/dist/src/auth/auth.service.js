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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const bycrpt = require("bcrypt");
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async validateUser(signInDto) {
        const { loginId, password } = signInDto;
        const user = await this.usersService.findOneByLoginId(loginId);
        if (!user) {
            throw new common_1.UnauthorizedException('loginId is incorrect');
        }
        if (!(await bycrpt.compare(password, user.password))) {
            throw new common_1.UnauthorizedException('password is incorrect');
        }
        return user;
    }
    async generateAccessToken(user) {
        const payload = {
            id: user.id,
            loginId: user.loginId,
            nickname: user.nickname,
            birth: user.birth,
            lastLogin: user.lastLogin,
        };
        const accessToken = this.jwtService.signAsync(payload);
        return accessToken;
    }
    async generateRefreshToken(user) {
        const payload = { id: user.id };
        return this.jwtService.signAsync(payload, {
            secret: process.env.JWT_REFRESH_TOKEN_SECRET,
            expiresIn: process.env.JWT_REFRESH_TOKEN_EXP,
        });
    }
    async refresh(refreshToken) {
        const { id } = await this.jwtService.verifyAsync(refreshToken, {
            secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        });
        const user = await this.usersService.getUserIfRefreshTokenMatches(refreshToken, id);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const accessToken = await this.generateAccessToken(user);
        return { accessToken };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map