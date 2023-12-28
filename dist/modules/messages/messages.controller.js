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
exports.MessagesController = void 0;
const common_1 = require("@nestjs/common");
const current_user_id_decorator_1 = require("../../commons/decorators/current-user-id.decorator");
const constants_1 = require("../../constants");
const dto_1 = require("./dto");
const find_many_messages_dto_1 = require("./dto/find-many-messages.dto");
const messages_read_service_1 = require("./services/messages-read.service");
const messages_write_service_1 = require("./services/messages-write.service");
let MessagesController = class MessagesController {
    constructor(readService, writeService) {
        this.readService = readService;
        this.writeService = writeService;
    }
    async read(payload, clientData) {
        await this.writeService.read(payload, clientData);
    }
    async findMany(queryParams, clientData) {
        const findResults = await this.readService.findMany(queryParams, clientData);
        return {
            type: constants_1.RESPONSE_TYPES.DELETE_PHOTO,
            _matchId: queryParams.matchId,
            data: findResults,
            pagination: this.readService.getPagination(findResults),
        };
    }
};
__decorate([
    (0, common_1.Post)('/read'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_id_decorator_1.Client)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ReadMessageDto, Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "read", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_id_decorator_1.Client)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_many_messages_dto_1.FindManyMessagesQuery, Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "findMany", null);
MessagesController = __decorate([
    (0, common_1.Controller)('messages'),
    __metadata("design:paramtypes", [messages_read_service_1.MessagesReadService,
        messages_write_service_1.MessagesWriteService])
], MessagesController);
exports.MessagesController = MessagesController;
//# sourceMappingURL=messages.controller.js.map