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
exports.AccessTokensService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const common_token_service_1 = require("../commons/services/common-token.service");
let AccessTokensService = class AccessTokensService extends common_token_service_1.CommonTokensService {
    constructor(jwtService) {
        super();
        this.jwtService = jwtService;
    }
    sign(authJwtPayload) {
        return this.jwtService.sign(authJwtPayload);
    }
    signFromUser(user) {
        const userId = user._id.toString();
        return this.sign({
            id: userId,
            role: user.role,
            sub: userId,
            haveProfile: user.haveProfile,
        });
    }
    verify(jwt, options) {
        return this.jwtService.verify(jwt, options);
    }
};
AccessTokensService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AccessTokensService);
exports.AccessTokensService = AccessTokensService;
//# sourceMappingURL=access-tokens.service.js.map