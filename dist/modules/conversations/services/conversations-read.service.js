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
exports.ConversationsReadService = void 0;
const common_1 = require("@nestjs/common");
const app_config_1 = require("../../../app.config");
const api_read_base_service_1 = require("../../../commons/services/api/api-read.base.service");
const utils_1 = require("../../../utils");
const match_model_1 = require("../../models/match.model");
let ConversationsReadService = class ConversationsReadService extends api_read_base_service_1.ApiReadService {
    constructor(matchModel, paginationUtil) {
        super();
        this.matchModel = matchModel;
        this.paginationUtil = paginationUtil;
        this.limitRecordsPerQuery = app_config_1.APP_CONFIG.PAGINATION_LIMIT.CONVERSATIONS;
    }
    async findMany(queryParams, clientData) {
        const { _currentUserId, currentUserId } = this.getClient(clientData);
        const { _next } = queryParams;
        const cursor = _next ? this.paginationUtil.getCursor(_next) : undefined;
        const findResults = await this.matchModel.findMany(Object.assign(Object.assign({}, this.matchModel.queryUserOneOrUserTwo(_currentUserId)), (cursor
            ? { 'lastMessage.createdAt': { $lt: cursor } }
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
            _next: lastField ? this.paginationUtil.encodeFromString(lastField) : null,
        };
    }
};
ConversationsReadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [match_model_1.MatchModel,
        utils_1.PaginationCursorStringUtil])
], ConversationsReadService);
exports.ConversationsReadService = ConversationsReadService;
//# sourceMappingURL=conversations-read.service.js.map