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
exports.SignInFacebookService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const libs_1 = require("../../../libs");
const models_1 = require("../../models");
const signed_device_model_1 = require("../../models/signed-device.model");
const user_model_1 = require("../../models/user.model");
const common_sign_in_service_1 = require("./common-sign-in.service");
let SignInFacebookService = class SignInFacebookService extends common_sign_in_service_1.CommonSignInService {
    constructor(userModel, signedDeviceModel, profileModel, accessTokensService, refreshTokensService) {
        super(userModel, profileModel, signedDeviceModel, accessTokensService, refreshTokensService);
        this.userModel = userModel;
        this.signedDeviceModel = signedDeviceModel;
        this.profileModel = profileModel;
        this.accessTokensService = accessTokensService;
        this.refreshTokensService = refreshTokensService;
    }
    async getSignInPayload(payload) {
        let facebookId;
        try {
            const { data: facebookResponse } = await axios_1.default.get(`https://graph.facebook.com/v8.0/me?access_token=${payload.token}`);
            this.logger.debug(`Received response from facebook: ${facebookResponse}`);
            facebookId = facebookResponse.id;
        }
        catch (err) {
            throw new common_1.BadRequestException();
        }
        return { facebookId };
    }
};
SignInFacebookService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_model_1.UserModel,
        signed_device_model_1.SignedDeviceModel,
        models_1.ProfileModel,
        libs_1.AccessTokensService,
        libs_1.RefreshTokensService])
], SignInFacebookService);
exports.SignInFacebookService = SignInFacebookService;
//# sourceMappingURL=sign-in-facebook.service.js.map