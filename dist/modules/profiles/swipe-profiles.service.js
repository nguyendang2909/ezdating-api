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
exports.SwipeProfilesService = void 0;
const common_1 = require("@nestjs/common");
const moment_1 = __importDefault(require("moment"));
const app_config_1 = require("../../app.config");
const models_1 = require("../models");
const profiles_common_service_1 = require("./profiles.common.service");
let SwipeProfilesService = class SwipeProfilesService extends profiles_common_service_1.ProfilesCommonService {
    constructor(profileModel, profileFilterModel, viewModel) {
        super();
        this.profileModel = profileModel;
        this.profileFilterModel = profileFilterModel;
        this.viewModel = viewModel;
        this.limitRecordsPerQuery = app_config_1.APP_CONFIG.PAGINATION_LIMIT.SWIPE_USERS;
    }
    async findMany(queryParams, clientData) {
        var _a;
        const { _currentUserId } = this.getClient(clientData);
        const currentProfile = await this.profileModel.findOneOrFailById(_currentUserId);
        const excludedUserIds = await this.getExcludedUserIds(currentProfile, queryParams.excludedUserId);
        const _stateId = queryParams.stateId
            ? this.getObjectId(queryParams.stateId)
            : (_a = currentProfile.state) === null || _a === void 0 ? void 0 : _a._id;
        const profileFilter = await this.profileFilterModel.findOneOrFail({
            _id: _currentUserId,
        });
        const users = await this.profileModel.findMany({
            lastActivatedAt: {
                $exists: true,
            },
            birthday: {
                $gte: (0, moment_1.default)().subtract(profileFilter.maxAge, 'years').toDate(),
                $lte: (0, moment_1.default)().subtract(profileFilter.minAge, 'years').toDate(),
            },
            _id: { $nin: excludedUserIds },
            gender: profileFilter.gender,
            'state._id': _stateId,
        }, this.profileModel.publicFields, { limit: this.limitRecordsPerQuery });
        return users;
    }
    async getExcludedUserIds(profile, excludedUserId) {
        var _a;
        const excludedUserIds = [profile._id];
        if (excludedUserId) {
            const excludedIds = Array.isArray(excludedUserId)
                ? excludedUserId.map((e) => this.getObjectId(e))
                : [this.getObjectId(excludedUserId)];
            excludedUserIds.push(...excludedIds);
        }
        const views = await this.viewModel.findMany({
            'profile._id': profile._id,
            'targetProfile.state._id': (_a = profile.state) === null || _a === void 0 ? void 0 : _a._id,
            isMatched: false,
            isLiked: false,
        }, { 'targetProfile._id': 1 }, { limit: 1000 });
        excludedUserIds.push(...views.map((e) => e.targetProfile._id));
        return excludedUserIds;
    }
};
SwipeProfilesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [models_1.ProfileModel,
        models_1.ProfileFilterModel,
        models_1.ViewModel])
], SwipeProfilesService);
exports.SwipeProfilesService = SwipeProfilesService;
//# sourceMappingURL=swipe-profiles.service.js.map