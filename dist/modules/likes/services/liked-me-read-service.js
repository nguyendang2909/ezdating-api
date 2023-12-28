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
exports.LikedMeReadService = void 0;
const common_1 = require("@nestjs/common");
const moment_1 = __importDefault(require("moment"));
const app_config_1 = require("../../../app.config");
const api_read_base_service_1 = require("../../../commons/services/api/api-read.base.service");
const utils_1 = require("../../../utils");
const models_1 = require("../../models");
let LikedMeReadService = class LikedMeReadService extends api_read_base_service_1.ApiReadService {
    constructor(viewModel, profileFilterModel, paginationUtil) {
        super();
        this.viewModel = viewModel;
        this.profileFilterModel = profileFilterModel;
        this.paginationUtil = paginationUtil;
        this.limitRecordsPerQuery = app_config_1.APP_CONFIG.PAGINATION_LIMIT.LIKES;
    }
    async findOneById(id, client) {
        const { _currentUserId } = this.getClient(client);
        const like = await this.viewModel.findOneOrFail([
            {
                $match: {
                    _id: this.getObjectId(id),
                    'targetProfile._id': _currentUserId,
                },
            },
        ]);
        return like;
    }
    async findMany(queryParams, client) {
        const { _currentUserId } = this.getClient(client);
        const { _next } = queryParams;
        const cursor = _next ? this.paginationUtil.getCursor(_next) : undefined;
        const filterProfile = await this.profileFilterModel.findOneOrFail({
            _id: _currentUserId,
        });
        const findResults = await this.viewModel.findMany(Object.assign(Object.assign({ 'targetProfile._id': _currentUserId }, (cursor ? { createdAt: { $lt: cursor } } : {})), { 'profile.birthday': {
                $gte: (0, moment_1.default)().subtract(filterProfile.maxAge, 'years').toDate(),
                $lte: (0, moment_1.default)().subtract(filterProfile.minAge, 'years').toDate(),
            }, isLiked: true, isMatched: false, 'profile.gender': filterProfile.gender }), {}, {
            sort: { createdAt: -1 },
            limit: this.limitRecordsPerQuery,
        });
        return findResults;
    }
    getPagination(data) {
        return this.paginationUtil.getPaginationByField(data, 'createdAt', this.limitRecordsPerQuery);
    }
};
LikedMeReadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [models_1.ViewModel,
        models_1.ProfileFilterModel,
        utils_1.PaginationCursorDateUtil])
], LikedMeReadService);
exports.LikedMeReadService = LikedMeReadService;
//# sourceMappingURL=liked-me-read-service.js.map