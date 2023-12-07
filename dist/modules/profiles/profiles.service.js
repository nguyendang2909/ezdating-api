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
var ProfilesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilesService = void 0;
const common_1 = require("@nestjs/common");
const messages_1 = require("../../commons/messages");
const libs_1 = require("../../libs");
const models_1 = require("../models");
const mongo_connection_1 = require("../models/mongo.connection");
const profiles_common_service_1 = require("./profiles.common.service");
let ProfilesService = ProfilesService_1 = class ProfilesService extends profiles_common_service_1.ProfilesCommonService {
    constructor(profileModel, profileFilterModel, stateModel, basicProfileModel, filesService, mediaFileModel, userModel, mongoConnection) {
        super();
        this.profileModel = profileModel;
        this.profileFilterModel = profileFilterModel;
        this.stateModel = stateModel;
        this.basicProfileModel = basicProfileModel;
        this.filesService = filesService;
        this.mediaFileModel = mediaFileModel;
        this.userModel = userModel;
        this.mongoConnection = mongoConnection;
        this.logger = new common_1.Logger(ProfilesService_1.name);
    }
    async createBasic(payload, client) {
        const { _currentUserId } = this.getClient(client);
        await this.profileModel.findOneAndFailById(_currentUserId);
        const { birthday: rawBirthday, stateId, latitude, longitude } = payload, rest = __rest(payload, ["birthday", "stateId", "latitude", "longitude"]);
        const state = await this.stateModel.findOneOrFailById(this.getObjectId(stateId));
        const birthday = this.getAndCheckValidBirthdayFromRaw(rawBirthday);
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
    async uploadBasicPhoto(file, payload, client) {
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
    async getMe(clientData) {
        const { id: currentUserId } = clientData;
        const _currentUserId = this.getObjectId(currentUserId);
        const profile = await this.profileModel.findOneById(_currentUserId);
        if (!profile) {
            return await this.basicProfileModel.findOneOrFailById(_currentUserId);
        }
        return profile;
    }
    async findOneOrFailById(id, _client) {
        const _id = this.getObjectId(id);
        const findResult = await this.profileModel.findOneOrFailById(_id);
        return findResult;
    }
    async updateMe(payload, client) {
        const { longitude, latitude, birthday: rawBirthday, stateId } = payload, updateDto = __rest(payload, ["longitude", "latitude", "birthday", "stateId"]);
        const { _currentUserId } = this.getClient(client);
        const updateOptions = {
            $set: Object.assign(Object.assign(Object.assign(Object.assign({}, updateDto), (rawBirthday
                ? { birthday: this.getAndCheckValidBirthdayFromRaw(rawBirthday) }
                : {})), (longitude && latitude
                ? {
                    geolocation: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                }
                : {})), (stateId
                ? {
                    state: await this.stateModel.findOneOrFailById(this.getObjectId(stateId)),
                }
                : {})),
        };
        await this.profileModel.updateOneById(_currentUserId, updateOptions);
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
ProfilesService = ProfilesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [models_1.ProfileModel,
        models_1.ProfileFilterModel,
        models_1.StateModel,
        models_1.BasicProfileModel,
        libs_1.FilesService,
        models_1.MediaFileModel,
        models_1.UserModel,
        mongo_connection_1.MongoConnection])
], ProfilesService);
exports.ProfilesService = ProfilesService;
//# sourceMappingURL=profiles.service.js.map