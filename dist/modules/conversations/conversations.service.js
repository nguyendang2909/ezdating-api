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
exports.ConversationsService = void 0;
const common_1 = require("@nestjs/common");
const app_config_1 = require("../../app.config");
const commons_1 = require("../../commons");
const match_model_1 = require("../models/match.model");
let ConversationsService = class ConversationsService extends commons_1.ApiCursorObjectIdService {
    constructor(matchModel) {
        super();
        this.matchModel = matchModel;
        this.limitRecordsPerQuery = app_config_1.APP_CONFIG.PAGINATION_LIMIT.CONVERSATIONS;
    }
    async findMany(queryParams, clientData) {
        const { _currentUserId, currentUserId } = this.getClient(clientData);
        const { _next } = queryParams;
        const cursor = _next ? this.getCursor(_next) : undefined;
        const findResults = await this.matchModel.findMany(Object.assign(Object.assign({}, this.matchModel.queryUserOneOrUserTwo(_currentUserId)), (cursor
            ? {
                'lastMessage.createdAt': {
                    $lt: cursor,
                },
            }
            : { 'lastMessage.createdAt': { $ne: null } })), {}, {
            sort: { 'lastMessage.createdAt': -1 },
            limit: this.limitRecordsPerQuery,
        });
        return this.matchModel.formatManyWithTargetProfile(findResults, currentUserId);
    }
    getPagination(data) {
        var _a, _b;
        const dataLength = data.length;
        if (!dataLength || dataLength < this.limitRecordsPerQuery) {
            return { _next: null };
        }
        const lastData = data[dataLength - 1];
        const lastField = (_b = (_a = lastData.lastMessage) === null || _a === void 0 ? void 0 : _a.createdAt) === null || _b === void 0 ? void 0 : _b.toString();
        return {
            _next: lastField ? this.encodeFromString(lastField) : null,
        };
    }
};
ConversationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [match_model_1.MatchModel])
], ConversationsService);
exports.ConversationsService = ConversationsService;
//# sourceMappingURL=conversations.service.js.map