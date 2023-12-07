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
exports.AdminAuthService = void 0;
const common_1 = require("@nestjs/common");
const libs_1 = require("../../../libs");
const models_1 = require("../../models");
let AdminAuthService = class AdminAuthService {
    constructor(userModel, accessTokensService) {
        this.userModel = userModel;
        this.accessTokensService = accessTokensService;
    }
    async login(payload) {
        const user = await this.userModel.findOneOrFail(payload);
        const accessToken = this.accessTokensService.signFromUser(user);
        return {
            accessToken,
        };
    }
};
AdminAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [models_1.UserModel,
        libs_1.AccessTokensService])
], AdminAuthService);
exports.AdminAuthService = AdminAuthService;
//# sourceMappingURL=admin-auth.service.js.map