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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilesScript = void 0;
const faker_1 = require("@faker-js/faker");
const common_1 = require("@nestjs/common");
const moment_1 = __importDefault(require("moment"));
const mongoose_1 = __importDefault(require("mongoose"));
const constants_1 = require("../../constants");
const libs_1 = require("../../libs");
const models_1 = require("../models");
const api_script_1 = require("./api.script");
let ProfilesScript = class ProfilesScript {
    constructor(profileModel, userModel, acessTokensService, apiScript, stateModel, profileFilterModel) {
        this.profileModel = profileModel;
        this.userModel = userModel;
        this.acessTokensService = acessTokensService;
        this.apiScript = apiScript;
        this.stateModel = stateModel;
        this.profileFilterModel = profileFilterModel;
        this.logger = new common_1.Logger(api_script_1.ApiScript.name);
    }
    onApplicationBootstrap() {
        this.createProfilesFemale().catch((err) => {
            this.logger.error(JSON.stringify(err));
        });
    }
    async createProfilesFemale() {
        if (process.env.NODE_ENV === 'staging') {
            const targetUser = await this.userModel.findOneOrFail({
                phoneNumber: '+84971016191',
            });
            const state = await this.stateModel.findOneOrFailById(new mongoose_1.default.Types.ObjectId('65574d3c942d1c7185fb339d'));
            const { mediaFiles } = await this.getSampleData();
            for (let index = 0; index < Infinity; index++) {
                this.logger.log('Create user');
                try {
                    const user = await this.userModel.createOne({
                        email: faker_1.faker.internet.email(),
                        role: constants_1.USER_ROLES.MEMBER,
                        status: constants_1.USER_STATUSES.ACTIVATED,
                    });
                    const profile = await this.profileModel.createOne({
                        _id: user._id,
                        birthday: (0, moment_1.default)(faker_1.faker.date.between({
                            from: (0, moment_1.default)().subtract(30, 'years').toDate(),
                            to: (0, moment_1.default)().subtract(25, 'years').toDate(),
                        })).toDate(),
                        gender: constants_1.GENDERS.FEMALE,
                        introduce: faker_1.faker.word.words(),
                        nickname: faker_1.faker.person.fullName(),
                        relationshipGoal: faker_1.faker.number.int({
                            min: 1,
                            max: 5,
                        }),
                        state,
                    });
                    await this.userModel.updateOneOrFailById(user._id, {
                        $set: { haveProfile: true },
                    });
                    await this.profileFilterModel.createOneFromProfile(profile);
                    const accessToken = this.acessTokensService.signFromUser(Object.assign(Object.assign({}, user), { haveProfile: true }));
                    this.apiScript.init(accessToken);
                    await this.apiScript.updateProfile();
                    const randomMediaFiles = this.getRandomMediaFiles(mediaFiles);
                    await this.profileModel.updateOneById(user._id, {
                        $set: {
                            mediaFiles: randomMediaFiles,
                        },
                    });
                    await this.apiScript.sendLike({
                        targetUserId: targetUser._id.toString(),
                    });
                }
                catch (err) {
                    this.logger.error(`Create user failed: ${JSON.stringify(err)}`);
                }
            }
        }
    }
    async getSampleData() {
        const sampleProfiles = await this.profileModel.findMany({
            gender: constants_1.GENDERS.FEMALE,
            'mediaFiles.1': { $exists: true },
        }, {}, { limit: 100 });
        const mediaFiles = sampleProfiles
            .filter((e) => { var _a; return ((_a = e.mediaFiles) === null || _a === void 0 ? void 0 : _a.length) > 0; })
            .flatMap((e) => {
            return e.mediaFiles;
        });
        return { mediaFiles };
    }
    getRandomMediaFiles(mediaFiles) {
        return faker_1.faker.helpers.arrayElements(mediaFiles, {
            min: 1,
            max: 6,
        });
    }
};
ProfilesScript = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [models_1.ProfileModel,
        models_1.UserModel,
        libs_1.AccessTokensService,
        api_script_1.ApiScript,
        models_1.StateModel,
        models_1.ProfileFilterModel])
], ProfilesScript);
exports.ProfilesScript = ProfilesScript;
//# sourceMappingURL=profiles.script.js.map