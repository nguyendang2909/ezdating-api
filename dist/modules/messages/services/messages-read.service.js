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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesReadService = void 0;
const common_1 = require("@nestjs/common");
const app_config_1 = require("../../../app.config");
const api_read_base_service_1 = require("../../../commons/services/api/api-read.base.service");
const utils_1 = require("../../../utils");
const match_model_1 = require("../../models/match.model");
const message_model_1 = require("../../models/message.model");
let MessagesReadService = class MessagesReadService extends api_read_base_service_1.ApiReadService {
    constructor(matchModel, messageModel, paginationUtil) {
        super();
        this.matchModel = matchModel;
        this.messageModel = messageModel;
        this.paginationUtil = paginationUtil;
        this.limitRecordsPerQuery = app_config_1.APP_CONFIG.PAGINATION_LIMIT.MESSAGES;
    }
    async findMany(queryParams, clientData) {
        const { matchId, _next } = queryParams;
        const cursor = _next ? this.paginationUtil.getCursor(_next) : undefined;
        const _matchId = this.getObjectId(matchId);
        const { _currentUserId, currentUserId } = this.getClient(clientData);
        const existMatch = await this.matchModel.findOneOrFail(Object.assign({ _id: _matchId }, this.matchModel.queryUserOneOrUserTwo(_currentUserId)));
        const findResults = await this.messageModel.findMany(Object.assign({ _matchId }, (cursor ? { createdAt: { $lt: cursor } } : {})), {}, {
            sort: { createdAt: -1 },
            limit: this.limitRecordsPerQuery,
        });
        this.handleAfterFindManyMessages({
            _matchId,
            currentUserId,
            match: existMatch,
        });
        return findResults;
    }
    getPagination(data) {
        return this.paginationUtil.getPaginationByField(data, 'createdAt', this.limitRecordsPerQuery);
    }
    async handleAfterFindManyMessages({ _matchId, currentUserId, match, }) {
        const isUserOne = this.matchModel.isUserOne({
            currentUserId,
            userOneId: match.profileOne._id.toString(),
        });
        await this.matchModel.updateOne({ _id: _matchId }, {
            $set: Object.assign({}, (isUserOne ? { userOneRead: true } : { userTwoRead: true })),
        });
    }
};
MessagesReadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [match_model_1.MatchModel,
        message_model_1.MessageModel,
        utils_1.PaginationCursorDateUtil])
], MessagesReadService);
exports.MessagesReadService = MessagesReadService;
//# sourceMappingURL=messages-read.service.js.map