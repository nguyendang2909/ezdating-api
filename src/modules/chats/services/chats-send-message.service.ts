import { Injectable, Logger } from '@nestjs/common';
import mongoose from 'mongoose';
import { Socket } from 'socket.io';

import { ERROR_MESSAGES } from '../../../commons/messages/error-messages.constant';
import { SocketBaseService } from '../../../commons/services/socket/socket.base.service';
import { SOCKET_TO_CLIENT_EVENTS } from '../../../constants';
import { Match, Message } from '../../models';
import { MatchModel } from '../../models/match.model';
import { MessageModel } from '../../models/message.model';
import { SignedDeviceModel } from '../../models/signed-device.model';
import { PushNotificationsService } from '../../push-notifications/push-notifications.service';
import { SendChatMessageDto } from '../dto/send-chat-message.dto';

@Injectable()
export class ChatsSendMessageService extends SocketBaseService {
  constructor(
    private readonly matchModel: MatchModel,
    private readonly messageModel: MessageModel,
    private readonly signedDeviceModel: SignedDeviceModel,
    private readonly pushNotificationsService: PushNotificationsService,
  ) {
    super();
  }

  logger = new Logger(ChatsSendMessageService.name);

  public async run(payload: SendChatMessageDto, socket: Socket) {
    const { matchId } = payload;
    const { currentUserId, _currentUserId } = this.getClient(socket);
    const _matchId = this.getObjectId(matchId);
    const match = await this.matchModel.findOne({
      _id: _matchId,
      ...this.matchModel.queryUserOneOrUserTwo(_currentUserId),
    });
    if (!match) {
      this.logger.error(`SEND_MESSAGE matchId ${matchId} does not exist`);
      socket.emit(SOCKET_TO_CLIENT_EVENTS.ERROR, {
        message: ERROR_MESSAGES['Match does not exist'],
      });
      return;
    }
    const message = await this.createMessage({
      payload,
      _currentUserId,
      _matchId,
    });
    this.handleAfterSendMessage({
      match,
      message,
      socket,
      currentUserId,
    });
  }

  async createMessage({
    payload,
    _currentUserId,
    _matchId,
  }: {
    _currentUserId: mongoose.Types.ObjectId;
    _matchId: mongoose.Types.ObjectId;
    payload: SendChatMessageDto;
  }) {
    const createPayload = {
      _userId: _currentUserId,
      _matchId,
      text: payload.text,
      uuid: payload.uuid,
    };
    this.logger.log(
      `SEND_MESSAGE Create message payload: ${JSON.stringify(createPayload)}`,
    );
    return await this.messageModel.createOne(createPayload);
  }

  async handleAfterSendMessage({
    match,
    message,
    socket,
    currentUserId,
  }: {
    currentUserId: string;
    match: Match;
    message: Message;
    socket: Socket;
  }) {
    const { profileOne, profileTwo } = match;
    const userOneId = profileOne._id.toString();
    const userTwoId = profileTwo._id.toString();
    const isUserOne = this.matchModel.isUserOne({ currentUserId, userOneId });
    this.matchModel
      .updateOneById(match._id, {
        $set: {
          lastMessage: message,
          ...(isUserOne
            ? { userTwoRead: false, userOneRead: true }
            : { userOneRead: false, userTwoRead: true }),
        },
      })
      .catch((error) => {
        this.logger.error(
          `SEND_MESSAGE Update matchId: ${match._id} failed: ${JSON.stringify(
            error,
          )}`,
        );
      });
    const emitRoomIds = [userOneId, userTwoId];
    this.logger.log(
      `SEND_MESSAGE Socket emit event: "${SOCKET_TO_CLIENT_EVENTS.UPDATE_SENT_MESSAGE}" to me payload: ${message}`,
    );
    socket.emit(SOCKET_TO_CLIENT_EVENTS.UPDATE_SENT_MESSAGE, message);
    this.logger.log(
      `SEND_MESSAGE Socket emit event: "${
        SOCKET_TO_CLIENT_EVENTS.NEW_MESSAGE
      }" to: ${JSON.stringify(emitRoomIds)} payload: ${message}`,
    );
    socket.to(emitRoomIds).emit(SOCKET_TO_CLIENT_EVENTS.NEW_MESSAGE, message);
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
}
