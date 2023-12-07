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
var ChatsConnectionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatsConnectionService = void 0;
const common_1 = require("@nestjs/common");
const lodash_1 = __importDefault(require("lodash"));
const db_service_1 = require("../../commons/services/db.service");
const constants_1 = require("../../constants");
const libs_1 = require("../../libs");
const user_model_1 = require("../models/user.model");
let ChatsConnectionService = ChatsConnectionService_1 = class ChatsConnectionService extends db_service_1.DbService {
    constructor(acessTokensService, userModel) {
        super();
        this.acessTokensService = acessTokensService;
        this.userModel = userModel;
        this.logger = new common_1.Logger(ChatsConnectionService_1.name);
    }
    async handleConnection(socket) {
        try {
            const token = socket.handshake.query.token;
            if (!token || !lodash_1.default.isString(token)) {
                socket.disconnect();
                return;
            }
            const clientData = this.acessTokensService.verify(token);
            const { id: userId } = clientData;
            const _currentUserId = this.getObjectId(userId);
            const user = await this.userModel.findOneOrFail({ _id: _currentUserId });
            if (!user || user.status === constants_1.USER_STATUSES.BANNED) {
                socket.disconnect();
                return;
            }
            socket.handshake.user = clientData;
            socket.join(userId);
            this.logger.log(`Socket connected: ${socket.id}`);
            return;
        }
        catch (err) {
            socket.disconnect();
        }
    }
};
ChatsConnectionService = ChatsConnectionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [libs_1.AccessTokensService,
        user_model_1.UserModel])
], ChatsConnectionService);
exports.ChatsConnectionService = ChatsConnectionService;
//# sourceMappingURL=chats-connection.service.js.map