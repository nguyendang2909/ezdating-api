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
var ChatsHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatsHandler = void 0;
const common_1 = require("@nestjs/common");
const db_service_1 = require("../../commons/services/db.service");
const constants_1 = require("../../constants");
const match_model_1 = require("../models/match.model");
const message_model_1 = require("../models/message.model");
const signed_device_model_1 = require("../models/signed-device.model");
const push_notifications_service_1 = require("../push-notifications/push-notifications.service");
let ChatsHandler = ChatsHandler_1 = class ChatsHandler extends db_service_1.DbService {
    constructor(matchModel, messageModel, signedDeviceModel, pushNotificationsService) {
        super();
        this.matchModel = matchModel;
        this.messageModel = messageModel;
        this.signedDeviceModel = signedDeviceModel;
        this.pushNotificationsService = pushNotificationsService;
        this.logger = new common_1.Logger(ChatsHandler_1.name);
    }
    async handleAfterSendMessage({ match, message, socket, currentUserId, }) {
        const { profileOne, profileTwo } = match;
        const userOneId = profileOne._id.toString();
        const userTwoId = profileTwo._id.toString();
        const isUserOne = this.matchModel.isUserOne({ currentUserId, userOneId });
        this.matchModel
            .updateOneById(match._id, {
            $set: Object.assign({ lastMessage: message }, (isUserOne
                ? { userTwoRead: false, userOneRead: true }
                : { userOneRead: false, userTwoRead: true })),
        })
            .catch((error) => {
            this.logger.error(`SEND_MESSAGE Update matchId: ${match._id} failed: ${JSON.stringify(error)}`);
        });
        const emitRoomIds = [userOneId, userTwoId];
        this.logger.log(`SEND_MESSAGE Socket emit event: "${constants_1.SOCKET_TO_CLIENT_EVENTS.UPDATE_SENT_MESSAGE}" to me payload: ${message}`);
        socket.emit(constants_1.SOCKET_TO_CLIENT_EVENTS.UPDATE_SENT_MESSAGE, message);
        this.logger.log(`SEND_MESSAGE Socket emit event: "${constants_1.SOCKET_TO_CLIENT_EVENTS.NEW_MESSAGE}" to: ${JSON.stringify(emitRoomIds)} payload: ${message}`);
        socket.to(emitRoomIds).emit(constants_1.SOCKET_TO_CLIENT_EVENTS.NEW_MESSAGE, message);
        const { _targetUserId } = this.matchModel.getTargetUserId({
            currentUserId,
            userOneId,
            userTwoId,
        });
        const msgText = message.text || '';
        this.pushNotificationsService.sendByUserId(_targetUserId, {
            content: msgText.length > 1300 ? `${msgText.slice(0, 300)}...` : msgText,
            title: 'You have received new message',
        });
    }
};
ChatsHandler = ChatsHandler_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [match_model_1.MatchModel,
        message_model_1.MessageModel,
        signed_device_model_1.SignedDeviceModel,
        push_notifications_service_1.PushNotificationsService])
], ChatsHandler);
exports.ChatsHandler = ChatsHandler;
//# sourceMappingURL=chats.handler.js.map