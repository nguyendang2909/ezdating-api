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
exports.RefreshTokensService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const app_config_1 = require("../app.config");
let RefreshTokensService = class RefreshTokensService {
    constructor(jwtService) {
        this.jwtService = jwtService;
        this.SECRET_KEY = process.env.JWT_REFRESH_TOKEN_SECRET_KEY;
    }
    sign(payload) {
        return this.jwtService.sign(payload, {
            expiresIn: `${app_config_1.APP_CONFIG.REFRESH_TOKEN_EXPIRES_AS_DAYS}d`,
            secret: this.SECRET_KEY,
        });
    }
    signFromUser(user) {
        const userId = user._id.toString();
        return this.sign({
            id: userId,
            sub: userId,
        });
    }
    verify(refreshToken) {
        return this.jwtService.verify(refreshToken, {
            secret: this.SECRET_KEY,
        });
    }
};
RefreshTokensService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], RefreshTokensService);
exports.RefreshTokensService = RefreshTokensService;
//# sourceMappingURL=refresh-tokens.service.js.map