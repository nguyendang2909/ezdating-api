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
exports.ProfileFiltersController = void 0;
const common_1 = require("@nestjs/common");
const current_user_id_decorator_1 = require("../../commons/decorators/current-user-id.decorator");
const constants_1 = require("../../constants");
const dto_1 = require("./dto");
const profile_filters_read_me_service_1 = require("./services/profile-filters-read-me.service");
const profile_filters_write_me_service_1 = require("./services/profile-filters-write-me.service");
let ProfileFiltersController = class ProfileFiltersController {
    constructor(readMeService, writeMeService) {
        this.readMeService = readMeService;
        this.writeMeService = writeMeService;
    }
    async update(payload, client) {
        await this.writeMeService.updateOne(payload, client);
    }
    async getMe(client) {
        return {
            type: constants_1.RESPONSE_TYPES.PROFILE_FILTER,
            data: await this.readMeService.findOne(client),
        };
    }
};
__decorate([
    (0, common_1.Patch)('/me'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_id_decorator_1.Client)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.UpdateProfileFilterDto, Object]),
    __metadata("design:returntype", Promise)
], ProfileFiltersController.prototype, "update", null);
__decorate([
    (0, common_1.Get)('/me'),
    __param(0, (0, current_user_id_decorator_1.Client)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileFiltersController.prototype, "getMe", null);
ProfileFiltersController = __decorate([
    (0, common_1.Controller)('profile-filters'),
    __metadata("design:paramtypes", [profile_filters_read_me_service_1.ProfileFiltersReadMeService,
        profile_filters_write_me_service_1.ProfileFiltersWriteMeService])
], ProfileFiltersController);
exports.ProfileFiltersController = ProfileFiltersController;
//# sourceMappingURL=profile-filters.controller.js.map