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
exports.SignInPhoneNumberWithPasswordService = void 0;
const common_1 = require("@nestjs/common");
const libs_1 = require("../../../libs");
const models_1 = require("../../models");
const common_sign_in_service_1 = require("./common-sign-in.service");
let SignInPhoneNumberWithPasswordService = class SignInPhoneNumberWithPasswordService extends common_sign_in_service_1.CommonSignInService {
    constructor(firebaseService, userModel, signedDeviceModel, profileModel, accessTokensService, refreshTokensService, passwordsService) {
        super(userModel, profileModel, signedDeviceModel, accessTokensService, refreshTokensService);
        this.firebaseService = firebaseService;
        this.userModel = userModel;
        this.signedDeviceModel = signedDeviceModel;
        this.profileModel = profileModel;
        this.accessTokensService = accessTokensService;
        this.refreshTokensService = refreshTokensService;
        this.passwordsService = passwordsService;
    }
    async getSignInPayload(payload) {
        const { phoneNumber, password } = payload;
        const user = await this.userModel.findOneOrFail({ phoneNumber });
        if (!user.password) {
            throw new common_1.BadRequestException('Try login with OTP!');
        }
        this.passwordsService.verifyCompare(password, user.password);
        return { phoneNumber };
    }
};
SignInPhoneNumberWithPasswordService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [libs_1.FirebaseService,
        models_1.UserModel,
        models_1.SignedDeviceModel,
        models_1.ProfileModel,
        libs_1.AccessTokensService,
        libs_1.RefreshTokensService,
        libs_1.PasswordsService])
], SignInPhoneNumberWithPasswordService);
exports.SignInPhoneNumberWithPasswordService = SignInPhoneNumberWithPasswordService;
//# sourceMappingURL=sign-in-phone-number-with-password.service.js.map