"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const users_module_1 = require("../users/users.module");
const jwt_refresh_strategy_1 = require("../../common/strategies/jwt-refresh.strategy");
const jwt_access_guard_1 = require("../../common/guards/jwt-access.guard");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule, users_module_1.UsersModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_ACCESS_TOKEN_SECRET'),
                    signOptions: {
                        expiresIn: configService.get('JWT_ACCESS_TOKEN_EXP'),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            (0, common_1.forwardRef)(() => users_module_1.UsersModule),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            config_1.ConfigService,
            jwt_refresh_strategy_1.JwtRefreshStrategy,
            jwt_access_guard_1.JwtAccessAuthGuard,
        ],
        exports: [auth_service_1.AuthService, jwt_1.JwtModule],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map