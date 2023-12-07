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
exports.SignInPhoneNumberService = void 0;
const common_1 = require("@nestjs/common");
const libs_1 = require("../../../libs");
const models_1 = require("../../models");
const common_sign_in_service_1 = require("./common-sign-in.service");
let SignInPhoneNumberService = class SignInPhoneNumberService extends common_sign_in_service_1.CommonSignInService {
    constructor(profileModel, userModel, signedDeviceModel, firebaseService, accessTokensService, refreshTokensService) {
        super(userModel, profileModel, signedDeviceModel, accessTokensService, refreshTokensService);
        this.profileModel = profileModel;
        this.userModel = userModel;
        this.signedDeviceModel = signedDeviceModel;
        this.firebaseService = firebaseService;
        this.accessTokensService = accessTokensService;
        this.refreshTokensService = refreshTokensService;
    }
    async getSignInPayload(payload) {
        const decoded = await this.firebaseService.decodeToken(payload.token);
        return { phoneNumber: decoded.phone_number };
    }
};
SignInPhoneNumberService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [models_1.ProfileModel,
        models_1.UserModel,
        models_1.SignedDeviceModel,
        libs_1.FirebaseService,
        libs_1.AccessTokensService,
        libs_1.RefreshTokensService])
], SignInPhoneNumberService);
exports.SignInPhoneNumberService = SignInPhoneNumberService;
//# sourceMappingURL=sign-in-phone-number.service.js.map