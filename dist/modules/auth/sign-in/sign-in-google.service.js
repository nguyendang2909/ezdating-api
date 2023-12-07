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
exports.SignInGoogleService = void 0;
const common_1 = require("@nestjs/common");
const libs_1 = require("../../../libs");
const models_1 = require("../../models");
const signed_device_model_1 = require("../../models/signed-device.model");
const user_model_1 = require("../../models/user.model");
const common_sign_in_service_1 = require("./common-sign-in.service");
let SignInGoogleService = class SignInGoogleService extends common_sign_in_service_1.CommonSignInService {
    constructor(userModel, signedDeviceModel, googleOauthService, profileModel, accessTokensService, refreshTokensService) {
        super(userModel, profileModel, signedDeviceModel, accessTokensService, refreshTokensService);
        this.userModel = userModel;
        this.signedDeviceModel = signedDeviceModel;
        this.googleOauthService = googleOauthService;
        this.profileModel = profileModel;
        this.accessTokensService = accessTokensService;
        this.refreshTokensService = refreshTokensService;
    }
    async getSignInPayload(payload) {
        const loginTicket = await this.googleOauthService.oauthClient.verifyIdToken({ idToken: payload.token });
        const loginTicketPayload = loginTicket.getPayload();
        if (!loginTicketPayload) {
            throw new common_1.BadRequestException();
        }
        return { email: loginTicketPayload.email };
    }
};
SignInGoogleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_model_1.UserModel,
        signed_device_model_1.SignedDeviceModel,
        libs_1.GoogleOAuthService,
        models_1.ProfileModel,
        libs_1.AccessTokensService,
        libs_1.RefreshTokensService])
], SignInGoogleService);
exports.SignInGoogleService = SignInGoogleService;
//# sourceMappingURL=sign-in-google.service.js.map