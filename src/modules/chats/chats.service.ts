import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';

import { SOCKET_TO_CLIENT_EVENTS } from '../../commons/constants';
import { HttpErrorMessages } from '../../commons/erros/http-error-messages.constant';
import { DbService } from '../../commons/services/db.service';
import { MatchDocument, MessageDocument } from '../models';
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
    const match = await this.matchModel.findOne(
      {
        _id: _matchId,
        $or: [{ _userOneId: _currentUserId }, { _userTwoId: _currentUserId }],
      },
      {
        _id: 1,
        _userOneId: 1,
        _userTwoId: 1,
      },
    );
    if (!match) {
      this.logger.log(`SEND_MESSAGE matchId ${matchId} does not exist`);
      socket.emit(SOCKET_TO_CLIENT_EVENTS.ERROR, {
        message: HttpErrorMessages['Match does not exist'],
      });

      return;
    }
    const createPayload = {
      _userId: _currentUserId,
      _matchId: match._id,
      text,
      uuid,
    };
    this.logger.log(
      `SEND_MESSAGE Create message payload: ${JSON.stringify(createPayload)}`,
    );
    const message = await this.messageModel.createOne(createPayload);
    this.handleAfterSendMessage({
      match,
      message,
      socket,
      currentUserId,
    });
  }

  public async readMessage(payload: ReadChatMessageDto, socket: Socket) {
    const { matchId, lastMessageId } = payload;
    const currentUserId = socket.handshake.user.id;
    const _currentUserId = this.getObjectId(currentUserId);
    const _lastMessageId = this.getObjectId(lastMessageId);
    const _id = this.getObjectId(matchId);
    await this.matchModel.updateOne(
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

  async handleAfterSendMessage({
    match,
    message,
    socket,
    currentUserId,
  }: {
    currentUserId: string;
    match: MatchDocument;
    message: MessageDocument;
    socket: Socket;
  }) {
    const { _userOneId, _userTwoId } = match;
    const userOneId = _userOneId.toString();
    const userTwoId = _userTwoId.toString();
    const isUserOne = currentUserId === userOneId;
    const rawMessage = message.toJSON();
    const updateMatchPayload = {
      $set: {
        lastMessage: rawMessage,
        ...(isUserOne
          ? { userTwoRead: false, userOneRead: true }
          : { userOneRead: false, userTwoRead: true }),
      },
    };
    this.logger.log(
      `SEND_MESSAGE Update matchId ${match._id} payload: ${JSON.stringify(
        updateMatchPayload,
      )}`,
    );
    this.matchModel
      .updateOneById(match._id, updateMatchPayload)
      .catch((error) => {
        this.logger.error(
          `SEND_MESSAGE Update matchId: ${
            match._id
          } with payload: ${JSON.stringify(
            updateMatchPayload,
          )} failed: ${JSON.stringify(error)}`,
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
    this.pushNotificationsService.sendByUserId(_targetUserId, {
      content: message.text || '',
      title: 'You have received new message',
    });
  }
}
