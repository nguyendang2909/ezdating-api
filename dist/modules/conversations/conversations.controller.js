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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationsController = void 0;
const common_1 = require("@nestjs/common");
const current_user_id_decorator_1 = require("../../commons/decorators/current-user-id.decorator");
const constants_1 = require("../../constants");
const find_many_conversations_dto_1 = require("./dto/find-many-conversations.dto");
const conversations_read_service_1 = require("./services/conversations-read.service");
let ConversationsController = class ConversationsController {
    constructor(conversationsService) {
        this.conversationsService = conversationsService;
    }
    async findMany(queryParams, clientData) {
        const findResults = await this.conversationsService.findMany(queryParams, clientData);
        return {
            type: constants_1.RESPONSE_TYPES.CONVERSATIONS,
            data: findResults,
            pagination: this.conversationsService.getPagination(findResults),
        };
    }
};
__decorate([
    (0, common_1.Get)('/'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_id_decorator_1.Client)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_many_conversations_dto_1.FindManyConversationsQuery, Object]),
    __metadata("design:returntype", Promise)
], ConversationsController.prototype, "findMany", null);
ConversationsController = __decorate([
    (0, common_1.Controller)('/conversations'),
    __metadata("design:paramtypes", [conversations_read_service_1.ConversationsReadService])
], ConversationsController);
exports.ConversationsController = ConversationsController;
//# sourceMappingURL=conversations.controller.js.map