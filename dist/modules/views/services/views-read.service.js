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
exports.ViewsReadService = void 0;
const common_1 = require("@nestjs/common");
const app_config_1 = require("../../../app.config");
const api_read_base_service_1 = require("../../../commons/services/api/api-read.base.service");
const utils_1 = require("../../../utils");
const models_1 = require("../../models");
let ViewsReadService = class ViewsReadService extends api_read_base_service_1.ApiReadService {
    constructor(viewModel, paginationUtil) {
        super();
        this.viewModel = viewModel;
        this.paginationUtil = paginationUtil;
        this.limitRecordsPerQuery = app_config_1.APP_CONFIG.PAGINATION_LIMIT.VIEWS;
    }
    async findMany(queryParams, client) {
        const { _currentUserId } = this.getClient(client);
        const { _next } = queryParams;
        const cursor = _next ? this.paginationUtil.getCursor(_next) : undefined;
        const findResults = await this.viewModel.findMany(Object.assign({ 'profile._id': _currentUserId, isLiked: false, isMatched: false }, (cursor
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
        return findResults;
    }
    getPagination(data) {
        return this.paginationUtil.getPaginationByField(data, 'createdAt', this.limitRecordsPerQuery);
    }
};
ViewsReadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [models_1.ViewModel,
        utils_1.PaginationCursorDateUtil])
], ViewsReadService);
exports.ViewsReadService = ViewsReadService;
//# sourceMappingURL=views-read.service.js.map