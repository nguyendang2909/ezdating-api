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
var FilesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesService = void 0;
const common_1 = require("@nestjs/common");
const aws_sdk_1 = require("aws-sdk");
const sharp_1 = __importDefault(require("sharp"));
const uuid_1 = require("uuid");
const messages_1 = require("../commons/messages");
const constants_1 = require("../constants");
const common_constants_1 = require("../constants/common.constants");
const models_1 = require("../modules/models");
let FilesService = FilesService_1 = class FilesService {
    constructor(mediaFileModel, profileModel) {
        this.mediaFileModel = mediaFileModel;
        this.profileModel = profileModel;
        this.awsBucketName = process.env.AWS_BUCKET_NAME;
        this.s3 = new aws_sdk_1.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: 'ap-southeast-1',
        });
        this.logger = new common_1.Logger(FilesService_1.name);
    }
    async uploadPhoto(file) {
        const fileBufferWithSharp = await (0, sharp_1.default)(file.buffer)
            .resize(640, 860)
            .toFormat('webp')
            .toBuffer();
        return await this.s3
            .upload({
            Bucket: this.awsBucketName,
            Key: `${common_constants_1.FILE_UPLOAD_FOLDERS.PHOTOS}/${(0, uuid_1.v4)()}.webp`,
            Body: fileBufferWithSharp,
            ACL: 'public-read',
        })
            .promise();
    }
    async createPhoto(file, _currentUserId) {
        const photo = await this.uploadPhoto(file);
        const mediaFile = await this.mediaFileModel
            .createOne({
            _userId: _currentUserId,
            key: photo.Key,
            type: constants_1.MEDIA_FILE_TYPES.photo,
            location: photo.Location,
        })
            .catch(async (error) => {
            this.logger.error(`Failed to create media file ${JSON.stringify(error)}`);
            await this.removeOneAndCatch(photo);
            throw new common_1.InternalServerErrorException(messages_1.ERROR_MESSAGES['Create failed, please try again']);
        });
        return mediaFile;
    }
    async removeOne(filePath) {
        const [folder, filename] = filePath.split('/');
        if (!common_constants_1.FILE_UPLOAD_FOLDERS_ARR.includes(folder) || !filename) {
            this.logger.error(`REMOVE_S3_FILE File does not exist: ${filePath}`);
            return;
        }
        return await this.s3
            .deleteObject({
            Bucket: this.awsBucketName,
            Key: filePath,
        })
            .promise();
    }
    async removeOneAndCatch(photo) {
        try {
            await this.removeOne(photo.Key);
        }
        catch (err) {
            this.logger.error(`S3 Failed to remove file ${photo.Key} with error: ${JSON.stringify(err)}`);
        }
    }
    async updateProfileAfterCreatePhoto(mediaFile, _currentUserId) {
        const updateResult = await this.profileModel
            .updateOneById(_currentUserId, {
            $push: {
                mediaFiles: {
                    _id: mediaFile._id,
                    key: mediaFile.key,
                    type: mediaFile.type,
                },
            },
        })
            .catch(() => {
            return undefined;
        });
        await this.verifyUpdateProfileAfterCreatePhoto(mediaFile, updateResult);
    }
    async verifyUpdateProfileAfterCreatePhoto(mediaFile, updateResult) {
        if (!(updateResult === null || updateResult === void 0 ? void 0 : updateResult.modifiedCount)) {
            await this.removeMediaFileAndCatch(mediaFile);
            throw new common_1.InternalServerErrorException(messages_1.ERROR_MESSAGES['File does not exist']);
        }
    }
    async removeMediaFile(mediaFile) {
        await this.removeOne(mediaFile.key);
        await this.mediaFileModel.deleteOneOrFail({ _id: mediaFile._id });
    }
    async removeMediaFileAndCatch(mediaFile) {
        try {
            await this.removeMediaFile(mediaFile);
        }
        catch (error) {
            this.logger.error(`Failed to remove photo ${JSON.stringify(error)}`);
        }
    }
};
FilesService = FilesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [models_1.MediaFileModel,
        models_1.ProfileModel])
], FilesService);
exports.FilesService = FilesService;
//# sourceMappingURL=files.service.js.map