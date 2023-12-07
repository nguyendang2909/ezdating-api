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
var ChatsGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatsGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const constants_1 = require("../../constants");
const chats_service_1 = require("./chats.service");
const chats_connection_service_1 = require("./chats-connection.service");
const send_chat_message_dto_1 = require("./dto/send-chat-message.dto");
const update_chat_message_dto_1 = require("./dto/update-chat-message.dto");
const ws_auth_guard_1 = require("./guards/ws-auth.guard");
let ChatsGateway = ChatsGateway_1 = class ChatsGateway {
    constructor(chatsService, chatsConnectionService) {
        this.chatsService = chatsService;
        this.chatsConnectionService = chatsConnectionService;
        this.logger = new common_1.Logger(ChatsGateway_1.name);
    }
    async sendMsg(socket, payload) {
        return await this.chatsService.sendMessage(payload, socket);
    }
    async editMessage(socket, payload) {
        return await this.chatsService.editMessage(payload, socket);
    }
    async handleConnection(socket) {
        return await this.chatsConnectionService.handleConnection(socket);
    }
    async handleDisconnect(socket) {
        socket.disconnect();
        this.logger.log(`Socket disconnected: ${socket.id}`);
    }
    afterInit() {
        this.logger.log('Socket initialized');
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_1.SOCKET_TO_SERVER_EVENTS.SEND_MESSAGE),
    (0, common_1.UseGuards)(ws_auth_guard_1.WsAuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
    })),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket,
        send_chat_message_dto_1.SendChatMessageDto]),
    __metadata("design:returntype", Promise)
], ChatsGateway.prototype, "sendMsg", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(constants_1.SOCKET_TO_SERVER_EVENTS.EDIT_MESSAGE),
    (0, common_1.UseGuards)(ws_auth_guard_1.WsAuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
    })),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket,
        update_chat_message_dto_1.UpdateChatMessageDto]),
    __metadata("design:returntype", Promise)
], ChatsGateway.prototype, "editMessage", null);
ChatsGateway = ChatsGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: '/chats',
        cors: true,
        origin: '*',
    }),
    __metadata("design:paramtypes", [chats_service_1.ChatsService,
        chats_connection_service_1.ChatsConnectionService])
], ChatsGateway);
exports.ChatsGateway = ChatsGateway;
//# sourceMappingURL=chats.gateway.js.map