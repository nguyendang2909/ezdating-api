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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignInController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const is_public_endpoint_1 = require("../../../commons/decorators/is-public.endpoint");
const dto_1 = require("../dto");
const sign_in_with_facebook_dto_1 = require("../dto/sign-in-with-facebook.dto");
const sign_in_with_phone_number_dto_1 = require("../dto/sign-in-with-phone-number.dto");
const sign_in_with_phone_number_and_password_dto_1 = require("../dto/sign-in-with-phone-number-and-password.dto");
const sign_in_facebook_service_1 = require("./sign-in-facebook.service");
const sign_in_google_service_1 = require("./sign-in-google.service");
const sign_in_phone_number_service_1 = require("./sign-in-phone-number.service");
const sign_in_phone_number_with_password_service_1 = require("./sign-in-phone-number-with-password.service");
let SignInController = class SignInController {
    constructor(signInPhoneNumberService, signInFacebookService, signInGoogleService, signInPhoneNumberWithPasswordService) {
        this.signInPhoneNumberService = signInPhoneNumberService;
        this.signInFacebookService = signInFacebookService;
        this.signInGoogleService = signInGoogleService;
        this.signInPhoneNumberWithPasswordService = signInPhoneNumberWithPasswordService;
    }
    async signInWithPhoneNumber(payload) {
        return {
            type: 'sigInWithPhoneNumber',
            data: await this.signInPhoneNumberService.signIn(payload),
        };
    }
    async signInWithGoogle(payload) {
        return {
            type: 'sigInWithGoogle',
            data: await this.signInGoogleService.signIn(payload),
        };
    }
    async signInWithFacebook(payload) {
        return {
            type: 'sigInWithFacebook',
            data: await this.signInFacebookService.signIn(payload),
        };
    }
    async signInWithPhoneNumberAndPassword(signInWithPhoneNumberAndPasswordDto) {
        return {
            type: 'signInWithPhoneNumberAndPassword',
            data: await this.signInPhoneNumberWithPasswordService.signIn(signInWithPhoneNumberAndPasswordDto),
        };
    }
};
__decorate([
    (0, common_1.Post)('/phone-number'),
    (0, is_public_endpoint_1.IsPublicEndpoint)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sign_in_with_phone_number_dto_1.SignInWithPhoneNumberDto]),
    __metadata("design:returntype", Promise)
], SignInController.prototype, "signInWithPhoneNumber", null);
__decorate([
    (0, common_1.Post)('/google'),
    (0, is_public_endpoint_1.IsPublicEndpoint)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SignInWithGoogleDto]),
    __metadata("design:returntype", Promise)
], SignInController.prototype, "signInWithGoogle", null);
__decorate([
    (0, common_1.Post)('/facebook'),
    (0, is_public_endpoint_1.IsPublicEndpoint)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sign_in_with_facebook_dto_1.SignInWithFacebookDto]),
    __metadata("design:returntype", Promise)
], SignInController.prototype, "signInWithFacebook", null);
__decorate([
    (0, common_1.Post)('/phone-number/password'),
    (0, is_public_endpoint_1.IsPublicEndpoint)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sign_in_with_phone_number_and_password_dto_1.SignInWithPhoneNumberAndPasswordDto]),
    __metadata("design:returntype", Promise)
], SignInController.prototype, "signInWithPhoneNumberAndPassword", null);
SignInController = __decorate([
    (0, common_1.Controller)('/auth/sign-in'),
    (0, swagger_1.ApiTags)('/auth/sign-in'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    __metadata("design:paramtypes", [sign_in_phone_number_service_1.SignInPhoneNumberService,
        sign_in_facebook_service_1.SignInFacebookService,
        sign_in_google_service_1.SignInGoogleService,
        sign_in_phone_number_with_password_service_1.SignInPhoneNumberWithPasswordService])
], SignInController);
exports.SignInController = SignInController;
//# sourceMappingURL=sign-in.controller.js.map