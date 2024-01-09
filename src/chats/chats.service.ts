import { Injectable, Logger } from '@nestjs/common';
import { Types } from 'mongoose';
import { Socket } from 'socket.io';

import { PushNotificationsService } from '../api/push-notifications/push-notifications.service';
import { ERROR_MESSAGES, SocketBaseService } from '../commons';
import { SOCKET_TO_CLIENT_EVENTS } from '../constants';
import { MatchModel, MessageModel, SignedDeviceModel } from '../models';
import { SendChatMessageDto } from './dto/send-chat-message.dto';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';

@Injectable()
export class ChatsService extends SocketBaseService {
  constructor(
    private readonly matchModel: MatchModel,
    private readonly messageModel: MessageModel,
    private readonly signedDeviceModel: SignedDeviceModel,
    private readonly pushNotificationsService: PushNotificationsService,
  ) {
    super();
  }

  logger = new Logger(ChatsService.name);

  public async editMessage(payload: UpdateChatMessageDto, socket: Socket) {
    const { id, text } = payload;
    const currentUserId = socket.handshake.user.id;
    const _currentUserId = this.getObjectId(currentUserId);
    const _id = this.getObjectId(id);
    const editResult = await this.messageModel.findOneAndUpdate(
      {
        _id,
        _userId: _currentUserId,
      },
      {
        $set: {
          text,
          isEdited: true,
        },
      },
      {
        new: true,
      },
    );
    if (!editResult) {
      socket.emit(SOCKET_TO_CLIENT_EVENTS.ERROR, {
        message: ERROR_MESSAGES['Update failed. Please try again.'],
      });

      return;
    }
    socket.emit(SOCKET_TO_CLIENT_EVENTS.UPDATE_SENT_MESSAGE, editResult);
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
        .emit(SOCKET_TO_CLIENT_EVENTS.EDIT_SENT_MESSAGE, editResult);
    }
  }

  async createMessage({
    payload,
    _currentUserId,
    _matchId,
  }: {
    _currentUserId: Types.ObjectId;
    _matchId: Types.ObjectId;
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
}
