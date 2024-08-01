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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const jwt_access_guard_1 = require("../../common/guards/jwt-access.guard");
const submit_test_dto_1 = require("./dto/submit-test.dto");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async submitTest(req, submitTestDto) {
        const { id } = req.user;
        try {
            return await this.usersService.submitTest(id, submitTestDto);
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to submit test');
        }
    }
    async getAchievements(req) {
        const { id } = req.user;
        try {
            return await this.usersService.getAchievements(id);
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to retrieve user achievements');
        }
    }
    async getProgressments(req) {
        const { id } = req.user;
        try {
            return await this.usersService.getProgressments(id);
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to retrieve user progress');
        }
    }
    async me(req) {
        return {
            statusCode: 200,
            message: 'Successfully fetched user',
            data: req.user,
        };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)('submitTest'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, submit_test_dto_1.SubmitTestDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "submitTest", null);
__decorate([
    (0, common_1.Get)('achievements'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAchievements", null);
__decorate([
    (0, common_1.Get)('progressments'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProgressments", null);
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "me", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_access_guard_1.JwtAccessAuthGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map