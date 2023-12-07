import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';

import { DbService } from '../../commons/services/db.service';
import { SOCKET_TO_CLIENT_EVENTS } from '../../constants';
import { Match, MessageDocument } from '../models';
import { MatchModel } from '../models/match.model';
import { MessageModel } from '../models/message.model';
import { SignedDeviceModel } from '../models/signed-device.model';
import { PushNotificationsService } from '../push-notifications/push-notifications.service';

@Injectable()
export class ChatsHandler extends DbService {
  constructor(
    private readonly matchModel: MatchModel,
    private readonly messageModel: MessageModel,
    private readonly signedDeviceModel: SignedDeviceModel,
    private readonly pushNotificationsService: PushNotificationsService,
  ) {
    super();
  }

  logger = new Logger(ChatsHandler.name);

  async handleAfterSendMessage({
    match,
    message,
    socket,
    currentUserId,
  }: {
    currentUserId: string;
    match: Match;
    message: MessageDocument;
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
