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
exports.AdminAuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const require_roles_decorator_1 = require("../../../commons/decorators/require-roles.decorator");
const constants_1 = require("../../../constants");
const admin_auth_service_1 = require("./admin-auth.service");
const dto_1 = require("./dto");
let AdminAuthController = class AdminAuthController {
    constructor(service) {
        this.service = service;
    }
    async signInWithPhoneNumber(payload) {
        return {
            type: 'adminLogin',
            data: await this.service.login(payload),
        };
    }
};
__decorate([
    (0, common_1.Post)('/login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.AdminLoginDto]),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "signInWithPhoneNumber", null);
AdminAuthController = __decorate([
    (0, common_1.Controller)('/admin/auth'),
    (0, swagger_1.ApiTags)('/auth/sign-in'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, require_roles_decorator_1.RequireRoles)([constants_1.USER_ROLES.ADMIN]),
    __metadata("design:paramtypes", [admin_auth_service_1.AdminAuthService])
], AdminAuthController);
exports.AdminAuthController = AdminAuthController;
//# sourceMappingURL=admin-auth.controller.js.map