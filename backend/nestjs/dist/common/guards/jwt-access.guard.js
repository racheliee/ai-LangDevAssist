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
exports.JwtAccessAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const jsonwebtoken_1 = require("jsonwebtoken");
let JwtAccessAuthGuard = class JwtAccessAuthGuard {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async canActivate(context) {
        try {
            const request = context.switchToHttp().getRequest();
            const access_token = request.cookies['access_token'];
            if (!access_token) {
                throw new common_1.UnauthorizedException('No access token provided');
            }
            const user = await this.jwtService.verify(access_token);
            request.user = user;
            return true;
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.TokenExpiredError) {
                throw new common_1.UnauthorizedException('Access token has expired');
            }
            else {
                throw new common_1.ForbiddenException('Invalid access token');
            }
        }
    }
};
exports.JwtAccessAuthGuard = JwtAccessAuthGuard;
exports.JwtAccessAuthGuard = JwtAccessAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], JwtAccessAuthGuard);
//# sourceMappingURL=jwt-access.guard.js.map