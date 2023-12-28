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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicProfileWriteService = void 0;
const common_1 = require("@nestjs/common");
const commons_1 = require("../../../commons");
const messages_1 = require("../../../commons/messages");
const libs_1 = require("../../../libs");
const utils_1 = require("../../../utils");
const models_1 = require("../../models");
const mongo_connection_1 = require("../../models/mongo.connection");
let BasicProfileWriteService = class BasicProfileWriteService extends commons_1.ApiWriteService {
    constructor(basicProfileModel, profileModel, profileFilterModel, stateModel, profilesUtil, mongoConnection, userModel, filesService) {
        super();
        this.basicProfileModel = basicProfileModel;
        this.profileModel = profileModel;
        this.profileFilterModel = profileFilterModel;
        this.stateModel = stateModel;
        this.profilesUtil = profilesUtil;
        this.mongoConnection = mongoConnection;
        this.userModel = userModel;
        this.filesService = filesService;
    }
    async createOne(payload, client) {
        const { _currentUserId } = this.getClient(client);
        await this.profileModel.findOneAndFailById(_currentUserId);
        const { birthday: rawBirthday, stateId, latitude, longitude } = payload, rest = __rest(payload, ["birthday", "stateId", "latitude", "longitude"]);
        const state = await this.stateModel.findOneOrFailById(this.getObjectId(stateId));
        const birthday = this.profilesUtil.verifyBirthdayFromRaw(rawBirthday);
        const basicProfile = await this.basicProfileModel.findOneAndUpdateById(_currentUserId, Object.assign(Object.assign(Object.assign({ _id: _currentUserId }, rest), { state,
            birthday }), (longitude && latitude
            ? {
                geolocation: {
                    type: 'Point',
                    coordinates: [longitude, latitude],
                },
            }
            : {})), { new: true, upsert: true });
        if (!basicProfile) {
            throw new common_1.InternalServerErrorException();
        }
        await this.profileFilterModel
            .createOneFromProfile(basicProfile)
            .catch((error) => {
            this.logger.error(`Failed to create profile filter from profile: ${JSON.stringify(basicProfile)} with error ${JSON.stringify(error)}`);
        });
        return basicProfile;
    }
    async createProfile(basicProfile, mediaFile) {
        await this.mongoConnection.withTransaction(async () => {
            await this.profileModel.createOne(Object.assign(Object.assign({}, basicProfile), { mediaFiles: [
                    {
                        _id: mediaFile._id,
                        key: mediaFile.key,
                        type: mediaFile.type,
                    },
                ] }));
            await this.userModel.updateOneById(basicProfile._id, {
                $set: { haveProfile: true },
            });
        });
        await this.basicProfileModel.deleteOne(basicProfile._id).catch((error) => {
            this.logger.error(`Failed to remove basic profile ${basicProfile._id.toString()} with error ${JSON.stringify(error)}`);
        });
    }
    async uploadPhoto(file, payload, client) {
        const { _currentUserId } = this.getClient(client);
        let { profile, basicProfile } = await this.tryFindProfileAndBasicProfile(_currentUserId);
        if (profile) {
            this.profileModel.verifyCanUploadFiles(profile);
        }
        return await this.mongoConnection.withTransaction(async () => {
            const mediaFile = await this.filesService.createPhoto(file, _currentUserId);
            if (profile) {
                await this.filesService.updateProfileAfterCreatePhoto(mediaFile, _currentUserId);
                return mediaFile;
            }
            if (basicProfile) {
                try {
                    await this.createProfile(basicProfile, mediaFile);
                }
                catch (error) {
                    profile = await this.profileModel.findOneById(_currentUserId);
                    if (profile) {
                        await this.filesService.updateProfileAfterCreatePhoto(mediaFile, _currentUserId);
                    }
                    await this.filesService.removeMediaFileAndCatch(mediaFile);
                    throw new common_1.NotFoundException(messages_1.ERROR_MESSAGES['Profile does not exist']);
                }
            }
            return mediaFile;
        });
    }
    async findOneOrFailById(id, _client) {
        const _id = this.getObjectId(id);
        const findResult = await this.profileModel.findOneOrFailById(_id);
        return findResult;
    }
    async tryFindProfileAndBasicProfile(_currentUserId) {
        let [profile, basicProfile] = await Promise.all([
            this.profileModel.findOneById(_currentUserId),
            this.basicProfileModel.findOneById(_currentUserId),
        ]);
        if (!profile && !basicProfile) {
            [profile, basicProfile] = await Promise.all([
                this.profileModel.findOneById(_currentUserId),
                this.basicProfileModel.findOneById(_currentUserId),
            ]);
            if (!profile && !basicProfile) {
                throw new common_1.NotFoundException(messages_1.ERROR_MESSAGES['Profile does not exist']);
            }
        }
        return { profile, basicProfile };
    }
};
BasicProfileWriteService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [models_1.BasicProfileModel,
        models_1.ProfileModel,
        models_1.ProfileFilterModel,
        models_1.StateModel,
        utils_1.ProfilesUtil,
        mongo_connection_1.MongoConnection,
        models_1.UserModel,
        libs_1.FilesService])
], BasicProfileWriteService);
exports.BasicProfileWriteService = BasicProfileWriteService;
//# sourceMappingURL=basic-profile-write.service.js.map