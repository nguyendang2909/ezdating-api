"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonSignInService = void 0;
const common_1 = require("@nestjs/common");
const moment_1 = __importDefault(require("moment"));
const app_config_1 = require("../../../app.config");
const commons_1 = require("../../../commons");
const messages_1 = require("../../../commons/messages");
class CommonSignInService extends commons_1.CommonService {
    constructor(userModel, profileModel, signedDeviceModel, accessTokensService, refreshTokensService) {
        super();
        this.userModel = userModel;
        this.profileModel = profileModel;
        this.signedDeviceModel = signedDeviceModel;
        this.accessTokensService = accessTokensService;
        this.refreshTokensService = refreshTokensService;
        this.logger = new common_1.Logger('SignInService');
    }
    async signIn(payload) {
        const signInPayload = await this.getSignInPayload(payload);
        return await this.getTokensFromSignInPayload(Object.assign({ deviceToken: payload.deviceToken, devicePlatform: payload.devicePlatform }, signInPayload));
    }
    async getSignInPayload(payload) {
        throw new common_1.InternalServerErrorException(messages_1.ERROR_MESSAGES['Not implemented']);
    }
    async getTokensFromSignInPayload(payload) {
        const { devicePlatform, deviceToken } = payload, rest = __rest(payload, ["devicePlatform", "deviceToken"]);
        const user = await this.userModel.findOneOrCreate(rest);
        const { accessToken, refreshToken } = this.createTokens(user);
        await this.createSession({
            _userId: user._id,
            refreshToken,
            deviceToken,
            devicePlatform,
        });
        return {
            accessToken,
            refreshToken,
        };
    }
    createTokens(user) {
        const accessToken = this.accessTokensService.signFromUser(user);
        const refreshToken = this.refreshTokensService.signFromUser(user);
        return { accessToken, refreshToken };
    }
    async createSession({ _userId, refreshToken, deviceToken, devicePlatform, }) {
        if (deviceToken && devicePlatform) {
            return await this.signedDeviceModel.findOneAndUpdate({ token: deviceToken }, {
                _userId,
                refreshToken: refreshToken,
                expiresIn: (0, moment_1.default)()
                    .add(app_config_1.APP_CONFIG.REFRESH_TOKEN_EXPIRES_AS_DAYS, 'days')
                    .toDate(),
                token: deviceToken,
                platform: devicePlatform,
            }, {
                new: true,
                upsert: true,
            });
        }
        return await this.signedDeviceModel.createOne({
            _userId,
            refreshToken: refreshToken,
            expiresIn: (0, moment_1.default)()
                .add(app_config_1.APP_CONFIG.REFRESH_TOKEN_EXPIRES_AS_DAYS, 'days')
                .toDate(),
        });
    }
}
exports.CommonSignInService = CommonSignInService;
//# sourceMappingURL=common-sign-in.service.js.map