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
var MatchesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchesService = void 0;
const common_1 = require("@nestjs/common");
const lodash_1 = __importDefault(require("lodash"));
const app_config_1 = require("../../app.config");
const commons_1 = require("../../commons");
const models_1 = require("../models");
const match_model_1 = require("../models/match.model");
const matches_handler_1 = require("./matches.handler");
let MatchesService = MatchesService_1 = class MatchesService extends commons_1.ApiCursorDateService {
    constructor(matchModel, profileModel, matchesHandler) {
        super();
        this.matchModel = matchModel;
        this.profileModel = profileModel;
        this.matchesHandler = matchesHandler;
        this.logger = new common_1.Logger(MatchesService_1.name);
        this.limitRecordsPerQuery = app_config_1.APP_CONFIG.PAGINATION_LIMIT.MATCHES;
    }
    async createOne(payload, clientData) {
        const { _currentUserId } = this.getClient(clientData);
        const { targetUserId } = payload;
        const _targetUserId = this.getObjectId(targetUserId);
        const { profileOne, profileTwo } = await this.profileModel.findTwoOrFailPublicByIds(_currentUserId, _targetUserId);
        await this.matchModel.findOneAndFail({
            'profileOne._id': profileOne._id,
            'profileTwo._id': profileTwo._id,
        });
        const createdMatch = await this.matchModel.createOne({
            profileOne,
            profileTwo,
        });
        this.matchesHandler.handleAfterCreateMatch({
            match: createdMatch,
            _currentUserId,
        });
        const restCreatedMatch = lodash_1.default.omit(createdMatch, ['profileOne', 'profileTwo']);
        return Object.assign(Object.assign({}, restCreatedMatch), { targetProfile: profileOne._id.toString() === targetUserId ? profileOne : profileTwo });
    }
    async unmatch(id, clientData) {
        const _id = this.getObjectId(id);
        const { id: currentUserId } = clientData;
        const _currentUserId = this.getObjectId(currentUserId);
        const existMatch = await this.matchModel.findOneOrFail({
            _id,
            $or: [
                { 'profileOne._id': _currentUserId },
                { 'profileTwo._id': _currentUserId },
            ],
        });
        await this.matchModel.deleteOneOrFail(Object.assign({ _id }, this.matchModel.queryUserOneOrUserTwo(_currentUserId)));
        this.matchesHandler.afterUnmatch({
            match: existMatch,
            currentUserId,
        });
        return {
            _id: existMatch._id,
        };
    }
    async findMany(queryParams, clientData) {
        const { _currentUserId, currentUserId } = this.getClient(clientData);
        const { _next } = queryParams;
        const cursor = _next ? this.getCursor(_next) : undefined;
        const findResults = await this.matchModel.findMany(Object.assign(Object.assign(Object.assign({}, this.matchModel.queryUserOneOrUserTwo(_currentUserId)), { lastMessage: { $exists: false } }), (cursor
            ? {
                createdAt: {
                    $lt: cursor,
                },
            }
            : {})), {}, {
            sort: {
                createdAt: -1,
            },
            limit: this.limitRecordsPerQuery,
        });
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
        return this.getPaginationByField(data, 'createdAt');
    }
};
MatchesService = MatchesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [match_model_1.MatchModel,
        models_1.ProfileModel,
        matches_handler_1.MatchesHandler])
], MatchesService);
exports.MatchesService = MatchesService;
//# sourceMappingURL=matches.service.js.map