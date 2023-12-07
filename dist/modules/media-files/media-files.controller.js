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
exports.MediaFilesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const app_config_1 = require("../../app.config");
const current_user_id_decorator_1 = require("../../commons/decorators/current-user-id.decorator");
const constants_1 = require("../../constants");
const upload_photo_dto_1 = require("./dto/upload-photo.dto");
const media_files_service_1 = require("./media-files.service");
let MediaFilesController = class MediaFilesController {
    constructor(mediaFilesService) {
        this.mediaFilesService = mediaFilesService;
    }
    async uploadPhoto(clientData, payload, file) {
        if (!file) {
            throw new common_1.BadRequestException({
                errorCode: 'FILE_NOT_FOUND',
                message: 'File not found!',
            });
        }
        return {
            type: constants_1.RESPONSE_TYPES.UPLOAD_PHOTO,
            data: await this.mediaFilesService.uploadPhoto(file, payload, clientData),
        };
    }
    async remove(id, clientData) {
        return {
            type: constants_1.RESPONSE_TYPES.DELETE_PHOTO,
            data: { success: await this.mediaFilesService.deleteOne(id, clientData) },
        };
    }
};
__decorate([
    (0, common_1.Post)('/photos'),
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
], MediaFilesController.prototype, "uploadPhoto", null);
__decorate([
    (0, common_1.Delete)('/photos/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_id_decorator_1.Client)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MediaFilesController.prototype, "remove", null);
MediaFilesController = __decorate([
    (0, common_1.Controller)('/media-files'),
    (0, swagger_1.ApiTags)('/media-files'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    __metadata("design:paramtypes", [media_files_service_1.MediaFilesService])
], MediaFilesController);
exports.MediaFilesController = MediaFilesController;
//# sourceMappingURL=media-files.controller.js.map