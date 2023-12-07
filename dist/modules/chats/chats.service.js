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
var ChatsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatsService = void 0;
const common_1 = require("@nestjs/common");
const error_messages_constant_1 = require("../../commons/messages/error-messages.constant");
const db_service_1 = require("../../commons/services/db.service");
const constants_1 = require("../../constants");
const match_model_1 = require("../models/match.model");
const message_model_1 = require("../models/message.model");
const signed_device_model_1 = require("../models/signed-device.model");
const push_notifications_service_1 = require("../push-notifications/push-notifications.service");
const chats_handler_1 = require("./chats.handler");
let ChatsService = ChatsService_1 = class ChatsService extends db_service_1.DbService {
    constructor(matchModel, messageModel, signedDeviceModel, pushNotificationsService, chatsHandler) {
        super();
        this.matchModel = matchModel;
        this.messageModel = messageModel;
        this.signedDeviceModel = signedDeviceModel;
        this.pushNotificationsService = pushNotificationsService;
        this.chatsHandler = chatsHandler;
        this.logger = new common_1.Logger(ChatsService_1.name);
    }
    async sendMessage(payload, socket) {
        const { matchId } = payload;
        const { currentUserId, _currentUserId } = this.getClient(socket.handshake.user);
        const _matchId = this.getObjectId(matchId);
        const match = await this.matchModel.findOne(Object.assign({ _id: _matchId }, this.matchModel.queryUserOneOrUserTwo(_currentUserId)));
        if (!match) {
            this.logger.log(`SEND_MESSAGE matchId ${matchId} does not exist`);
            socket.emit(constants_1.SOCKET_TO_CLIENT_EVENTS.ERROR, {
                message: error_messages_constant_1.ERROR_MESSAGES['Match does not exist'],
            });
            return;
        }
        const message = await this.createMessage({
            payload,
            _currentUserId,
            _matchId,
        });
        this.chatsHandler.handleAfterSendMessage({
            match,
            message,
            socket,
            currentUserId,
        });
    }
    async editMessage(payload, socket) {
        const { id, text } = payload;
        const currentUserId = socket.handshake.user.id;
        const _currentUserId = this.getObjectId(currentUserId);
        const _id = this.getObjectId(id);
        const editResult = await this.messageModel.findOneAndUpdate({
            _id,
            _userId: _currentUserId,
        }, {
            $set: {
                text,
                isEdited: true,
            },
        }, {
            new: true,
        });
        if (!editResult) {
            socket.emit(constants_1.SOCKET_TO_CLIENT_EVENTS.ERROR, {
                message: error_messages_constant_1.ERROR_MESSAGES['Update failed. Please try again.'],
            });
            return;
        }
        socket.emit(constants_1.SOCKET_TO_CLIENT_EVENTS.UPDATE_SENT_MESSAGE, editResult);
        if (!editResult._matchId) {
            return;
        }
        const match = await this.matchModel.model
            .findOne({ _id: editResult._matchId })
            .lean()
            .exec();
        if (!match) {
            return;
        }
        if (match && match.profileOne._id && match.profileTwo._id) {
            socket
                .to([match.profileOne._id.toString(), match.profileOne._id.toString()])
                .emit(constants_1.SOCKET_TO_CLIENT_EVENTS.EDIT_SENT_MESSAGE, editResult);
        }
    }
    async createMessage({ payload, _currentUserId, _matchId, }) {
        const createPayload = {
            _userId: _currentUserId,
            _matchId,
            text: payload.text,
            uuid: payload.uuid,
        };
        this.logger.log(`SEND_MESSAGE Create message payload: ${JSON.stringify(createPayload)}`);
        return await this.messageModel.createOne(createPayload);
    }
};
ChatsService = ChatsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [match_model_1.MatchModel,
        message_model_1.MessageModel,
        signed_device_model_1.SignedDeviceModel,
        push_notifications_service_1.PushNotificationsService,
        chats_handler_1.ChatsHandler])
], ChatsService);
exports.ChatsService = ChatsService;
//# sourceMappingURL=chats.service.js.map