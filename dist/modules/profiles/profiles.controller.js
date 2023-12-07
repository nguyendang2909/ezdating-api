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
exports.ProfilesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const app_config_1 = require("../../app.config");
const current_user_id_decorator_1 = require("../../commons/decorators/current-user-id.decorator");
const require_roles_decorator_1 = require("../../commons/decorators/require-roles.decorator");
const messages_1 = require("../../commons/messages");
const constants_1 = require("../../constants");
const upload_photo_dto_1 = require("../media-files/dto/upload-photo.dto");
const dto_1 = require("./dto");
const nearby_profiles_service_1 = require("./nearby-profiles.service");
const profiles_service_1 = require("./profiles.service");
const swipe_profiles_service_1 = require("./swipe-profiles.service");
let ProfilesController = class ProfilesController {
    constructor(service, swipeProfilesService, nearbyProfilesService) {
        this.service = service;
        this.swipeProfilesService = swipeProfilesService;
        this.nearbyProfilesService = nearbyProfilesService;
    }
    async createBasicProfile(payload, client) {
        return {
            type: constants_1.RESPONSE_TYPES.CREATE_BASIC_PROFILE,
            data: await this.service.createBasic(payload, client),
        };
    }
    async uploadBasicPhoto(clientData, payload, file) {
        if (!file) {
            throw new common_1.BadRequestException({
                message: messages_1.ERROR_MESSAGES['File does not exist'],
            });
        }
        return {
            type: constants_1.RESPONSE_TYPES.UPLOAD_PHOTO,
            data: await this.service.uploadBasicPhoto(file, payload, clientData),
        };
    }
    async getProfile(clientData) {
        return {
            type: constants_1.RESPONSE_TYPES.PROFILE,
            data: await this.service.getMe(clientData),
        };
    }
    async updateMe(payload, clientData) {
        await this.service.updateMe(payload, clientData);
    }
    async findManySwipe(queryParams, clientData) {
        const profiles = await this.swipeProfilesService.findMany(queryParams, clientData);
        return {
            type: constants_1.RESPONSE_TYPES.SWIPE_PROFILES,
            data: profiles,
            pagination: { _next: null },
        };
    }
    async findManyNearby(queryParams, clientData) {
        const findResults = await this.nearbyProfilesService.findMany(queryParams, clientData);
        return {
            type: constants_1.RESPONSE_TYPES.NEARBY_PROFILES,
            data: findResults,
            pagination: this.nearbyProfilesService.getPagination(findResults),
        };
    }
    async test() {
        return await this.nearbyProfilesService.test();
    }
    async findOneById(id, client) {
        return {
            type: constants_1.RESPONSE_TYPES.PROFILE,
            data: await this.service.findOneOrFailById(id, client),
        };
    }
};
__decorate([
    (0, common_1.Post)('/me/basic'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_id_decorator_1.Client)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateBasicProfileDto, Object]),
    __metadata("design:returntype", Promise)
], ProfilesController.prototype, "createBasicProfile", null);
__decorate([
    (0, common_1.Post)('/me/basic-photo'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        limits: {
            fileSize: app_config_1.APP_CONFIG.UPLOAD_PHOTO_MAX_FILE_SIZE,
        },
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.startsWith('image/')) {
                req.fileValidationError = 'goes wrong on the mimetype';
                return cb(new common_1.BadRequestException({
                    errorCode: 'PHOTO_TYPE_INCORRECT',
                    message: 'Photo type incorrect!',
                }), false);
            }
            cb(null, true);
        },
    })),
    __param(0, (0, current_user_id_decorator_1.Client)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, upload_photo_dto_1.UploadPhotoDtoDto, Object]),
    __metadata("design:returntype", Promise)
], ProfilesController.prototype, "uploadBasicPhoto", null);
__decorate([
    (0, common_1.Get)('/me'),
    __param(0, (0, current_user_id_decorator_1.Client)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfilesController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Patch)('/me'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_id_decorator_1.Client)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.UpdateMyProfileDto, Object]),
    __metadata("design:returntype", Promise)
], ProfilesController.prototype, "updateMe", null);
__decorate([
    (0, common_1.Get)('/swipe'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_id_decorator_1.Client)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.FindManySwipeProfilesQuery, Object]),
    __metadata("design:returntype", Promise)
], ProfilesController.prototype, "findManySwipe", null);
__decorate([
    (0, common_1.Get)('/nearby'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_id_decorator_1.Client)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.FindManyNearbyProfilesQuery, Object]),
    __metadata("design:returntype", Promise)
], ProfilesController.prototype, "findManyNearby", null);
__decorate([
    (0, common_1.Get)('/test'),
    (0, require_roles_decorator_1.RequireRoles)([constants_1.USER_ROLES.ADMIN]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProfilesController.prototype, "test", null);
__decorate([
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_id_decorator_1.Client)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProfilesController.prototype, "findOneById", null);
ProfilesController = __decorate([
    (0, common_1.Controller)('/profiles'),
    (0, swagger_1.ApiTags)('/profiles'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    __metadata("design:paramtypes", [profiles_service_1.ProfilesService,
        swipe_profiles_service_1.SwipeProfilesService,
        nearby_profiles_service_1.NearbyProfilesService])
], ProfilesController);
exports.ProfilesController = ProfilesController;
//# sourceMappingURL=profiles.controller.js.map