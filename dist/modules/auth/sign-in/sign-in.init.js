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
var SignInInitService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignInInitService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../../../constants");
const libs_1 = require("../../../libs");
const user_model_1 = require("../../models/user.model");
let SignInInitService = SignInInitService_1 = class SignInInitService {
    constructor(userModel, passwordsService) {
        this.userModel = userModel;
        this.passwordsService = passwordsService;
        this.logger = new common_1.Logger(SignInInitService_1.name);
    }
    async onApplicationBootstrap() {
        try {
            const phoneNumber = '+84971016191';
            const existAdminUser = await this.userModel.findOne({
                phoneNumber,
            });
            if (!existAdminUser && process.env.ADMIN_PASSWORD) {
                await this.userModel.createOne({
                    phoneNumber,
                    password: this.passwordsService.hash(process.env.ADMIN_PASSWORD),
                    role: constants_1.USER_ROLES.ADMIN,
                });
            }
        }
        catch (err) {
            this.logger.log(JSON.stringify(err));
        }
    }
};
SignInInitService = SignInInitService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_model_1.UserModel,
        libs_1.PasswordsService])
], SignInInitService);
exports.SignInInitService = SignInInitService;
//# sourceMappingURL=sign-in.init.js.map