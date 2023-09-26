import { Injectable, Logger } from '@nestjs/common';
import moment from 'moment';
import { Socket } from 'socket.io';

import { SOCKET_TO_CLIENT_EVENTS } from '../../commons/constants';
import { HttpErrorMessages } from '../../commons/erros/http-error-messages.constant';
import { DbService } from '../../commons/services/db.service';
import { MatchModel } from '../models/match.model';
import { MessageModel } from '../models/message.model';
import { UserModel } from '../models/user.model';
import { SendChatMessageDto } from './dto/send-chat-message.dto';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';

@Injectable()
export class ChatsService extends DbService {
  constructor(
    private readonly matchModel: MatchModel,
    // private readonly relationshipModel: RelationshipModel,
    private readonly messageModel: MessageModel,
    private readonly userModel: UserModel,
  ) {
    super();
  }

  private readonly logger = new Logger(ChatsService.name);

  public async sendMessage(payload: SendChatMessageDto, socket: Socket) {
    const { matchId, text, uuid } = payload;
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

    socket.emit(SOCKET_TO_CLIENT_EVENTS.UPDATE_MESSAGE, message);

    socket
      .to([userOneId, userTwoId])
      .emit(SOCKET_TO_CLIENT_EVENTS.NEW_MESSAGE, message);
  }

  public async editMessage(payload: UpdateChatMessageDto, socket: Socket) {
    const { id, text } = payload;
    const currentUserId = socket.handshake.user.id;
    const _currentUserId = this.getObjectId(currentUserId);
    const _id = this.getObjectId(id);

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
      socket.emit(SOCKET_TO_CLIENT_EVENTS.ERROR, {
        message: HttpErrorMessages['Update failed. Please try again.'],
      });

      return;
    }

    socket.emit(SOCKET_TO_CLIENT_EVENTS.UPDATE_MESSAGE, editResult);

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
