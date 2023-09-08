import { Injectable, Logger } from '@nestjs/common';
import moment from 'moment';
import { Socket } from 'socket.io';

import { Constants } from '../../commons/constants/constants';
import { HttpErrorCodes } from '../../commons/erros/http-error-codes.constant';
import { HttpErrorMessages } from '../../commons/erros/http-error-messages.constant';
import { MatchModel } from '../models/match.model';
import { MessageModel } from '../models/message.model';
import { UserModel } from '../models/user.model';
import { SendChatMessageDto } from './dto/send-chat-message.dto';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';

@Injectable()
export class ChatsService {
  constructor(
    private readonly matchModel: MatchModel,
    // private readonly relationshipModel: RelationshipModel,
    private readonly messageModel: MessageModel,
    private readonly userModel: UserModel,
  ) {}

  private readonly logger = new Logger(ChatsService.name);

  public async sendMessage(payload: SendChatMessageDto, socket: Socket) {
    const { matchId, text, uuid } = payload;
    const currentUserId = socket.handshake.user.id;
    const _currentUserId = this.userModel.getObjectId(currentUserId);
    const _matchId = this.matchModel.getObjectId(matchId);

    const existMatch = await this.matchModel.findOneRelatedToUserId(
      _matchId,
      _currentUserId,
    );

    if (!existMatch) {
      socket.emit(Constants.socketEvents.toClient.error, {
        errorCode: HttpErrorCodes.MATCH_DOES_NOT_EXIST,
        message: 'Match does not exist',
      });

      return;
    }

    const { _userOneId, _userTwoId } = existMatch;

    if (!_userOneId || !_userTwoId) {
      socket.emit(Constants.socketEvents.toClient.error, {
        errorCode: HttpErrorCodes.MATCH_IS_INVALID,
        message: 'Match is invalid',
      });

      return;
    }

    const userOneId = _userOneId.toString();
    const userTwoId = _userTwoId.toString();
    const isUserOne = currentUserId === userOneId;

    const messageCreatedAt = moment().toDate();
    // TODO: transaction
    const [createdMessage] = await Promise.all([
      this.messageModel.model.create({
        _userId: _currentUserId,
        _matchId: existMatch._id,
        text,
        uuid,
        createdAt: messageCreatedAt,
      }),
      this.matchModel.model.updateOne(
        { _id: existMatch._id },
        {
          $set: {
            lastMessageAt: messageCreatedAt,
            lastMessage: text,
            _lastMessageUserId: currentUserId,
            ...(isUserOne
              ? { userTwoRead: false, userOneRead: true }
              : { userOneRead: false, userTwoRead: true }),
          },
        },
      ),
    ]);

    const message = createdMessage.toJSON();

    socket.emit(Constants.socketEvents.toClient.updateMessage, message);

    socket
      .to([userOneId, userTwoId])
      .emit(Constants.socketEvents.toClient.newMessage, message);
  }

  public async editMessage(payload: UpdateChatMessageDto, socket: Socket) {
    const { id, text } = payload;
    const currentUserId = socket.handshake.user.id;
    const _currentUserId = this.userModel.getObjectId(currentUserId);
    const _id = this.messageModel.getObjectId(id);

    const editResult = await this.messageModel.model
      .findOneAndUpdate(
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
      )
      .lean()
      .exec();

    if (!editResult) {
      socket.emit(Constants.socketEvents.toClient.error, {
        message: HttpErrorMessages.UPDATE_FAILED,
      });

      return;
    }

    socket.emit(Constants.socketEvents.toClient.updateMessage, editResult);

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
        .emit(Constants.socketEvents.toClient.newMessage, editResult);
    }
  }
}
