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
exports.NearbyProfilesService = void 0;
const common_1 = require("@nestjs/common");
const moment_1 = __importDefault(require("moment"));
const app_config_1 = require("../../app.config");
const messages_1 = require("../../commons/messages");
const models_1 = require("../models");
const profiles_common_service_1 = require("./profiles.common.service");
let NearbyProfilesService = class NearbyProfilesService extends profiles_common_service_1.ProfilesCommonService {
    constructor(profileModel, profileFilterModel) {
        super();
        this.profileModel = profileModel;
        this.profileFilterModel = profileFilterModel;
        this.limitRecordsPerQuery = app_config_1.APP_CONFIG.PAGINATION_LIMIT.NEARBY_USERS;
    }
    async findMany(queryParams, client) {
        const { _currentUserId } = this.getClient(client);
        const { _next } = queryParams;
        const geolocation = queryParams.longitude && queryParams.latitude
            ? this.getGeolocationFromQueryParams(queryParams)
            : (await this.profileModel.findOneOrFailById(_currentUserId))
                .geolocation;
        if (!geolocation) {
            throw new common_1.BadRequestException(messages_1.ERROR_MESSAGES['Please enable location service in your device']);
        }
        const minDistance = (_next ? this.getCursor(_next) : 0) + 0.00000000001;
        const profileFilter = await this.profileFilterModel.findOneOrFail({
            _id: _currentUserId,
        });
        const maxDistance = profileFilter.maxDistance * 1000;
        if (minDistance && minDistance >= maxDistance) {
            return [];
        }
        const findResults = await this.profileModel.aggregate([
            {
                $geoNear: {
                    key: 'geolocation',
                    near: geolocation,
                    distanceField: 'distance',
                    minDistance,
                    maxDistance: maxDistance,
                    query: {
                        lastActivatedAt: {
                            $exists: true,
                        },
                        birthday: {
                            $gte: (0, moment_1.default)().subtract(profileFilter.maxAge, 'years').toDate(),
                            $lte: (0, moment_1.default)().subtract(profileFilter.minAge, 'years').toDate(),
                        },
                        gender: profileFilter.gender,
                    },
                },
            },
            { $limit: this.limitRecordsPerQuery },
            { $project: this.profileModel.publicFields },
        ]);
        return findResults;
    }
    getPagination(data) {
        const dataLength = data.length;
        if (!dataLength || dataLength < this.limitRecordsPerQuery) {
            return { _next: null };
        }
        const lastData = data[dataLength - 1];
        return {
            _next: this.encodeFromString(`${lastData.distance}`),
        };
    }
    getCursor(_cursor) {
        const cursor = this.decodeToString(_cursor);
        return +cursor;
    }
    async test() {
        return await this.profileModel.model.find({
            lastActivatedAt: {
                $gt: (0, moment_1.default)().subtract(20, 'hours'),
            },
        }, {}, {
            sort: {
                lastActivatedAt: 1,
            },
            limit: 10,
        });
    }
};
NearbyProfilesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [models_1.ProfileModel,
        models_1.ProfileFilterModel])
], NearbyProfilesService);
exports.NearbyProfilesService = NearbyProfilesService;
//# sourceMappingURL=nearby-profiles.service.js.map