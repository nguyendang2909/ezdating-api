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
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const app_config_1 = require("../../app.config");
const api_service_1 = require("../../commons/services/api.service");
const match_model_1 = require("../models/match.model");
const message_model_1 = require("../models/message.model");
const user_model_1 = require("../models/user.model");
let MessagesService = class MessagesService extends api_service_1.ApiService {
    constructor(matchModel, userModel, messageModel) {
        super();
        this.matchModel = matchModel;
        this.userModel = userModel;
        this.messageModel = messageModel;
        this.limitRecordsPerQuery = app_config_1.APP_CONFIG.PAGINATION_LIMIT.MESSAGES;
    }
    async read(payload, client) {
        const { _currentUserId } = this.getClient(client);
        const { matchId, lastMessageId } = payload;
        const _lastMessageId = this.getObjectId(lastMessageId);
        const _id = this.getObjectId(matchId);
        await this.matchModel.updateOne({
            _id,
            _lastMessageId,
            $or: [
                { _userOneId: _currentUserId, userOneRead: false },
                { _userOneId: _currentUserId, userTwoRead: false },
            ],
        }, {
            $set: {
                userOneRead: true,
                userTwoRead: true,
            },
        });
    }
    async findMany(queryParams, clientData) {
        const { matchId, _next } = queryParams;
        const cursor = _next ? this.getCursor(_next) : undefined;
        const _matchId = this.getObjectId(matchId);
        const { id: currentUserId } = clientData;
        const _currentUserId = this.getObjectId(currentUserId);
        const existMatch = await this.matchModel.findOneOrFail(Object.assign({ _id: _matchId }, this.matchModel.queryUserOneOrUserTwo(_currentUserId)));
        const findResults = await this.messageModel.findMany(Object.assign({ _matchId }, (cursor ? { createdAt: { $lt: cursor } } : {})), {}, {
            sort: { createdAt: -1 },
            limit: this.limitRecordsPerQuery,
            lean: true,
        });
        this.handleAfterFindManyMessages({
            _matchId,
            currentUserId,
            match: existMatch,
        });
        return findResults;
    }
    getPagination(data) {
        return this.getPaginationByField(data, '_id');
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
MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [match_model_1.MatchModel,
        user_model_1.UserModel,
        message_model_1.MessageModel])
], MessagesService);
exports.MessagesService = MessagesService;
//# sourceMappingURL=messages.service.js.map