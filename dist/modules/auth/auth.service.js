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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const moment_1 = __importDefault(require("moment"));
const app_config_1 = require("../../app.config");
const commons_1 = require("../../commons");
const messages_1 = require("../../commons/messages");
const libs_1 = require("../../libs");
const signed_device_model_1 = require("../models/signed-device.model");
const user_model_1 = require("../models/user.model");
let AuthService = class AuthService extends commons_1.ApiBaseService {
    constructor(signedDeviceModel, userModel, refreshTokensService, accessTokensService) {
        super();
        this.signedDeviceModel = signedDeviceModel;
        this.userModel = userModel;
        this.refreshTokensService = refreshTokensService;
        this.accessTokensService = accessTokensService;
    }
    async logout(payload) {
        const { refreshToken } = payload;
        const { id: currentUserId } = this.refreshTokensService.verify(refreshToken);
        const _currentUserId = this.getObjectId(currentUserId);
        await this.signedDeviceModel.deleteOne({
            _userId: _currentUserId,
            refreshToken,
        });
    }
    async refreshAccessToken(payload) {
        const { id: currentUserId } = this.refreshTokensService.verify(payload.refreshToken);
        const _currentUserId = this.getObjectId(currentUserId);
        const user = await this.userModel.findOneOrFail({
            _id: _currentUserId,
        });
        const accessToken = this.accessTokensService.signFromUser(user);
        return { accessToken };
    }
    async refreshToken(payload) {
        const { refreshToken: currentRefreshToken } = payload;
        const { id: currentUserId } = this.refreshTokensService.verify(currentRefreshToken);
        const _currentUserId = this.getObjectId(currentUserId);
        await this.userModel.findOneOrFail({ _id: _currentUserId });
        const loggedDevice = await this.signedDeviceModel.findOneOrFail({
            refreshToken: currentRefreshToken,
        });
        const newRefreshToken = this.refreshTokensService.sign({
            id: currentUserId,
            sub: currentUserId,
        });
        const updateResult = await this.signedDeviceModel.updateOneById(loggedDevice._id, {
            $set: {
                refreshToken: newRefreshToken,
                expiresIn: (0, moment_1.default)().add(app_config_1.APP_CONFIG.REFRESH_TOKEN_EXPIRES_AS_DAYS, 'days'),
            },
        });
        if (!updateResult.modifiedCount) {
            throw new common_1.UnauthorizedException({
                message: messages_1.ERROR_MESSAGES['Update refresh token failed'],
            });
        }
        return { refreshToken: newRefreshToken };
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [signed_device_model_1.SignedDeviceModel,
        user_model_1.UserModel,
        libs_1.RefreshTokensService,
        libs_1.AccessTokensService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map