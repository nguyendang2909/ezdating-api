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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileModel = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const moment_1 = __importDefault(require("moment"));
const mongoose_2 = require("mongoose");
const app_config_1 = require("../../app.config");
const error_messages_constant_1 = require("../../commons/messages/error-messages.constant");
const libs_1 = require("../../libs");
const common_model_1 = require("./bases/common-model");
const profile_schema_1 = require("./schemas/profile.schema");
let ProfileModel = class ProfileModel extends common_model_1.CommonModel {
    constructor(model, cacheService) {
        super();
        this.model = model;
        this.cacheService = cacheService;
        this.publicFields = {
            _id: 1,
            birthday: 1,
            company: 1,
            createdAt: 1,
            distance: 1,
            educationLevel: 1,
            gender: 1,
            height: 1,
            hideAge: 1,
            hideDistance: 1,
            introduce: 1,
            jobTitle: 1,
            languages: 1,
            lastActivatedAt: 1,
            mediaFiles: {
                _id: 1,
                key: 1,
                type: 1,
            },
            nickname: 1,
            photoVerified: 1,
            relationshipGoal: 1,
            relationshipStatus: 1,
            school: 1,
            state: 1,
            weight: 1,
        };
        this.matchProfileFields = {
            _id: 1,
            birthday: 1,
            createdAt: 1,
            gender: 1,
            hideAge: 1,
            hideDistance: 1,
            mediaFiles: {
                _id: 1,
                key: 1,
                type: 1,
            },
            nickname: 1,
            photoVerified: 1,
            state: 1,
        };
        this.conflictMessage = error_messages_constant_1.ERROR_MESSAGES['Profile already exists'];
        this.notFoundMessage = error_messages_constant_1.ERROR_MESSAGES['Profile does not exist'];
    }
    async createOne(doc) {
        const createResult = await this.model.create(doc);
        return createResult.toJSON();
    }
    async findTwoOrFailPublicByIds(_userId, _otherUserId) {
        const [profileOne, profileTwo] = await this.findMany({
            _id: { $in: [_userId, _otherUserId] },
        }, this.publicFields, {
            sort: {
                _id: 1,
            },
            limit: 2,
            lean: true,
        });
        if (!profileOne || !profileTwo) {
            throw new common_1.NotFoundException(error_messages_constant_1.ERROR_MESSAGES['User does not exist']);
        }
        return { profileOne, profileTwo };
    }
    getAgeFromBirthday(birthday) {
        return (0, moment_1.default)().diff(birthday, 'years');
    }
    verifyCanUploadFiles(profile) {
        var _a;
        const count = ((_a = profile.mediaFiles) === null || _a === void 0 ? void 0 : _a.length) || 0;
        if (count >= app_config_1.APP_CONFIG.UPLOAD_PHOTOS_LIMIT) {
            throw new common_1.BadRequestException({
                message: error_messages_constant_1.ERROR_MESSAGES['You can only upload 6 media files'],
            });
        }
        return count;
    }
};
ProfileModel = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(profile_schema_1.Profile.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        libs_1.CacheService])
], ProfileModel);
exports.ProfileModel = ProfileModel;
//# sourceMappingURL=profile.model.js.map