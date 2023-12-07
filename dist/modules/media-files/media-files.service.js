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
var MediaFilesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaFilesService = void 0;
const common_1 = require("@nestjs/common");
const messages_1 = require("../../commons/messages");
const api_service_1 = require("../../commons/services/api.service");
const files_service_1 = require("../../libs/files.service");
const models_1 = require("../models");
let MediaFilesService = MediaFilesService_1 = class MediaFilesService extends api_service_1.ApiService {
    constructor(filesService, profileModel, mediaFileModel) {
        super();
        this.filesService = filesService;
        this.profileModel = profileModel;
        this.mediaFileModel = mediaFileModel;
        this.logger = new common_1.Logger(MediaFilesService_1.name);
    }
    async uploadPhoto(file, payload, client) {
        const { _currentUserId } = this.getClient(client);
        const profile = await this.profileModel.findOneOrFailById(_currentUserId);
        this.profileModel.verifyCanUploadFiles(profile);
        const mediaFile = await this.filesService.createPhoto(file, _currentUserId);
        await this.filesService.updateProfileAfterCreatePhoto(mediaFile, _currentUserId);
        return mediaFile;
    }
    async deleteOne(id, client) {
        const _id = this.getObjectId(id);
        const { _currentUserId } = this.getClient(client);
        const profile = await this.profileModel.findOneOrFail({
            _id: _currentUserId,
            'mediaFiles._id': _id,
        }, {
            _id: true,
            key: true,
        });
        if (profile.mediaFiles.length <= 1) {
            throw new common_1.BadRequestException(messages_1.ERROR_MESSAGES['You should have at least 1 photo']);
        }
        const updateResult = await this.profileModel.updateOne({
            _id: _currentUserId,
            'mediaFiles._id': _id,
            mediaFiles: { $size: { $gt: 1 } },
        }, {
            $pull: {
                mediaFiles: {
                    _id,
                },
            },
        });
        if (updateResult.modifiedCount) {
            throw new common_1.InternalServerErrorException();
        }
        await this.mediaFileModel
            .deleteOne({
            _id,
            _userId: _currentUserId,
        })
            .catch((error) => {
            this.logger.error(`Failed to delete media file ${id} error ${JSON.stringify(error)}`);
        });
        const mediaFile = profile.mediaFiles.find((e) => e._id.toString() === id);
        if (mediaFile && mediaFile.key) {
            await this.filesService.removeOne(mediaFile.key);
        }
    }
};
MediaFilesService = MediaFilesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [files_service_1.FilesService,
        models_1.ProfileModel,
        models_1.MediaFileModel])
], MediaFilesService);
exports.MediaFilesService = MediaFilesService;
//# sourceMappingURL=media-files.service.js.map