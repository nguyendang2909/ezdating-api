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
const sign_in_controller_1 = require("./sign-in/sign-in.controller");
const sign_in_init_1 = require("./sign-in/sign-in.init");
const sign_in_facebook_service_1 = require("./sign-in/sign-in-facebook.service");
const sign_in_google_service_1 = require("./sign-in/sign-in-google.service");
const sign_in_phone_number_service_1 = require("./sign-in/sign-in-phone-number.service");
const sign_in_phone_number_with_password_service_1 = require("./sign-in/sign-in-phone-number-with-password.service");
const jwt_auth_strategy_1 = require("./strategies/jwt-auth.strategy");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        controllers: [sign_in_controller_1.SignInController, auth_controller_1.AuthController],
        providers: [
            jwt_auth_strategy_1.JwtStrategy,
            auth_service_1.AuthService,
            sign_in_init_1.SignInInitService,
            sign_in_facebook_service_1.SignInFacebookService,
            sign_in_google_service_1.SignInGoogleService,
            sign_in_phone_number_service_1.SignInPhoneNumberService,
            sign_in_phone_number_with_password_service_1.SignInPhoneNumberWithPasswordService,
        ],
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map