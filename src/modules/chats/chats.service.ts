import { Injectable, Logger } from '@nestjs/common';
import { Types } from 'mongoose';
import { Socket } from 'socket.io';

import { HttpErrorMessages } from '../../commons/erros/http-error-messages.constant';
import { DbService } from '../../commons/services/db.service';
import { SOCKET_TO_CLIENT_EVENTS } from '../../constants';
import { MatchModel } from '../models/match.model';
import { MessageModel } from '../models/message.model';
import { SignedDeviceModel } from '../models/signed-device.model';
import { PushNotificationsService } from '../push-notifications/push-notifications.service';
import { ChatsHandler } from './chats.handler';
import { SendChatMessageDto } from './dto/send-chat-message.dto';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';

@Injectable()
export class ChatsService extends DbService {
  constructor(
    private readonly matchModel: MatchModel,
    private readonly messageModel: MessageModel,
    private readonly signedDeviceModel: SignedDeviceModel,
    private readonly pushNotificationsService: PushNotificationsService,
    private chatsHandler: ChatsHandler,
  ) {
    super();
  }

  private readonly logger = new Logger(ChatsService.name);

  public async sendMessage(payload: SendChatMessageDto, socket: Socket) {
    const { matchId } = payload;
    const { currentUserId, _currentUserId } = this.getClient(
      socket.handshake.user,
    );
    const _matchId = this.getObjectId(matchId);
    const match = await this.matchModel.findOne({
      _id: _matchId,
      ...this.matchModel.queryUserOneOrUserTwo(_currentUserId),
    });
    if (!match) {
      this.logger.log(`SEND_MESSAGE matchId ${matchId} does not exist`);
      socket.emit(SOCKET_TO_CLIENT_EVENTS.ERROR, {
        message: HttpErrorMessages['Match does not exist'],
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
        message: HttpErrorMessages['Update failed. Please try again.'],
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
