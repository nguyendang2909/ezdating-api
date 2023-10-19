import { Injectable, Logger } from '@nestjs/common';
import moment from 'moment';
import { Socket } from 'socket.io';

import { SOCKET_TO_CLIENT_EVENTS } from '../../commons/constants';
import { HttpErrorMessages } from '../../commons/erros/http-error-messages.constant';
import { DbService } from '../../commons/services/db.service';
import { MatchModel } from '../models/match.model';
import { MessageModel } from '../models/message.model';
import { SignedDeviceModel } from '../models/signed-device.model';
import { UserModel } from '../models/user.model';
import { PushNotificationsService } from '../push-notifications/push-notifications.service';
import { ReadChatMessageDto } from './dto/read-chat-message.dto';
import { SendChatMessageDto } from './dto/send-chat-message.dto';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';

@Injectable()
export class ChatsService extends DbService {
  constructor(
    private readonly matchModel: MatchModel,
    // private readonly relationshipModel: RelationshipModel,
    private readonly messageModel: MessageModel,
    private readonly userModel: UserModel,
    private readonly signedDeviceModel: SignedDeviceModel,
    private readonly pushNotificationsService: PushNotificationsService,
  ) {
    super();
  }

  private readonly logger = new Logger(ChatsService.name);

  public async sendMessage(payload: SendChatMessageDto, socket: Socket) {
    const { matchId, text, uuid } = payload;
    if (!text) {
      return;
    }
    const currentUserId = socket.handshake.user.id;
    const _currentUserId = this.getObjectId(currentUserId);
    const _matchId = this.getObjectId(matchId);
    const existMatch = await this.matchModel.findOneRelatedToUserId(
      _matchId,
      _currentUserId,
    );
    if (!existMatch) {
      socket.emit(SOCKET_TO_CLIENT_EVENTS.ERROR, {
        message: HttpErrorMessages['Match does not exist'],
      });

      return;
    }
    const { _userOneId, _userTwoId } = existMatch;
    if (!_userOneId || !_userTwoId) {
      socket.emit(SOCKET_TO_CLIENT_EVENTS.ERROR, {
        message: HttpErrorMessages['Match is invalid'],
      });
      return;
    }
    const userOneId = _userOneId.toString();
    const userTwoId = _userTwoId.toString();
    const isUserOne = currentUserId === userOneId;
    const messageCreatedAt = moment().toDate();
    // TODO: transaction
    const createdMessage = await this.messageModel.createOne({
      _userId: _currentUserId,
      _matchId: existMatch._id,
      text,
      uuid,
      createdAt: messageCreatedAt,
    });
    await this.matchModel.updateOne(
      { _id: existMatch._id },
      {
        $set: {
          lastMessageAt: messageCreatedAt,
          lastMessage: text?.slice(0, 100),
          _lastMessageId: createdMessage._id,
          _lastMessageUserId: _currentUserId,
          ...(isUserOne
            ? { userTwoRead: false, userOneRead: true }
            : { userOneRead: false, userTwoRead: true }),
        },
      },
    );
    const message = createdMessage.toJSON();
    socket.emit(SOCKET_TO_CLIENT_EVENTS.UPDATE_SENT_MESSAGE, message);
    socket
      .to([userOneId, userTwoId])
      .emit(SOCKET_TO_CLIENT_EVENTS.NEW_MESSAGE, message);
    const { _targetUserId } = this.matchModel.getTargetUserId({
      currentUserId,
      userOneId,
      userTwoId,
    });
    await this.pushNotificationsService.sendByUserId(_targetUserId, {
      content: text,
      title: 'You have received new message',
    });
  }

  public async readMessage(payload: ReadChatMessageDto, socket: Socket) {
    const { matchId, lastMessageId } = payload;
    const currentUserId = socket.handshake.user.id;
    const _currentUserId = this.getObjectId(currentUserId);
    const _lastMessageId = this.getObjectId(lastMessageId);
    const _id = this.getObjectId(matchId);
    await this.matchModel.updateOneOrFail(
      {
        _id,
        _lastMessageId,
        $or: [
          { _userOneId: _currentUserId, userOneRead: false },
          { _userOneId: _currentUserId, userTwoRead: false },
        ],
      },
      {
        $set: {
          userOneRead: true,
          userTwoRead: true,
        },
      },
    );
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
    if (match && match._userOneId && match._userTwoId) {
      socket
        .to([match._userOneId.toString(), match._userTwoId.toString()])
        .emit(SOCKET_TO_CLIENT_EVENTS.NEW_MESSAGE, editResult);
    }
  }
}
