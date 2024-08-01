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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const sign_in_dto_1 = require("./dto/sign-in.dto");
const users_service_1 = require("../users/users.service");
const sign_up_dto_1 = require("./dto/sign-up.dto");
const passport_1 = require("@nestjs/passport");
let AuthController = class AuthController {
    constructor(authService, usersService) {
        this.authService = authService;
        this.usersService = usersService;
    }
    async signUp(signUpDTO) {
        const user = await this.usersService.create(signUpDTO);
        return {
            statusCode: 201,
            message: 'Successfully signed up',
            data: user,
        };
    }
    async signIn(signInDTO, res) {
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
    }
    async refresh(req, res) {
        try {
            const refreshToken = req.cookies['refresh_token'];
            if (!refreshToken) {
                throw new Error('No refresh token provided');
            }
            const { accessToken } = await this.authService.refresh(refreshToken);
            res.setHeader('Authorization', 'Bearer ' + accessToken);
            res.cookie('access_token', accessToken, { httpOnly: true });
            res.send({ accessToken });
        }
        catch (error) {
            throw error;
        }
    }
    async signOut(req, res) {
        await this.usersService.removeRefreshToken(req.user.id);
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        return {
            statusCode: 200,
            message: 'Successfully signed out',
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('signup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sign_up_dto_1.SignUpDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signUp", null);
__decorate([
    (0, common_1.Post)('signin'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sign_in_dto_1.SignInDTO, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signIn", null);
__decorate([
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('signout'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt-refresh-token')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signOut", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_service_1.UsersService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map