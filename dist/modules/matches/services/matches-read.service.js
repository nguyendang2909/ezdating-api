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
exports.MatchesReadService = void 0;
const common_1 = require("@nestjs/common");
const lodash_1 = __importDefault(require("lodash"));
const app_config_1 = require("../../../app.config");
const api_read_base_service_1 = require("../../../commons/services/api/api-read.base.service");
const utils_1 = require("../../../utils");
const models_1 = require("../../models");
const matches_handler_1 = require("../matches.handler");
let MatchesReadService = class MatchesReadService extends api_read_base_service_1.ApiReadService {
    constructor(matchModel, profileModel, matchesHandler, paginationUtil) {
        super();
        this.matchModel = matchModel;
        this.profileModel = profileModel;
        this.matchesHandler = matchesHandler;
        this.paginationUtil = paginationUtil;
        this.limitRecordsPerQuery = app_config_1.APP_CONFIG.PAGINATION_LIMIT.MATCHES;
    }
    async findMany(queryParams, clientData) {
        const { _currentUserId, currentUserId } = this.getClient(clientData);
        const { _next } = queryParams;
        const cursor = _next ? this.paginationUtil.getCursor(_next) : undefined;
        const findResults = await this.matchModel.findMany(Object.assign(Object.assign(Object.assign({}, this.matchModel.queryUserOneOrUserTwo(_currentUserId)), { lastMessage: { $exists: false } }), (cursor ? { createdAt: { $lt: cursor } } : {})), {}, { sort: { createdAt: -1 }, limit: this.limitRecordsPerQuery });
        return this.matchModel.formatManyWithTargetProfile(findResults, currentUserId);
    }
    async findOneOrFailById(id, client) {
        const { _currentUserId, currentUserId } = this.getClient(client);
        const _id = this.getObjectId(id);
        const match = await this.matchModel.findOneOrFail(Object.assign({ _id }, this.matchModel.queryUserOneOrUserTwo(_currentUserId)));
        const isUserOne = this.matchModel.isUserOne({
            currentUserId,
            userOneId: match.profileOne._id.toString(),
        });
        const { profileOne, profileTwo } = await this.profileModel.findTwoOrFailPublicByIds(match.profileOne._id, match.profileTwo._id);
        this.matchesHandler.afterFindOneMatch({ match, profileOne, profileTwo });
        return Object.assign(Object.assign({}, lodash_1.default.omit(match, ['profileOne', 'profileTwo'])), { targetProfile: isUserOne ? profileTwo : profileOne });
    }
    async findOneByTargetUserId(targetUserId, client) {
        const { _userOneId, _userTwoId, isUserOne } = this.matchModel.getSortedUserIds({
            currentUserId: client.id,
            targetUserId,
        });
        const [{ profileOne, profileTwo }, match] = await Promise.all([
            this.profileModel.findTwoOrFailPublicByIds(_userOneId, _userTwoId),
            this.matchModel.findOneOrFail({
                'profileOne._id': _userOneId,
                'profileTwo._id': _userTwoId,
            }),
        ]);
        this.matchesHandler.afterFindOneMatch({ match, profileOne, profileTwo });
        return Object.assign(Object.assign({}, lodash_1.default.omit(match, ['profileOne', 'profileTwo'])), { targetProfile: isUserOne ? profileTwo : profileOne });
    }
    getPagination(data) {
        return this.paginationUtil.getPaginationByField(data, 'createdAt', this.limitRecordsPerQuery);
    }
};
MatchesReadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [models_1.MatchModel,
        models_1.ProfileModel,
        matches_handler_1.MatchesHandler,
        utils_1.PaginationCursorDateUtil])
], MatchesReadService);
exports.MatchesReadService = MatchesReadService;
//# sourceMappingURL=matches-read.service.js.map