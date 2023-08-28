import { Injectable, Logger } from '@nestjs/common';
import moment from 'moment';
import { Socket } from 'socket.io';

import { Constants } from '../../commons/constants/constants';
import { HttpErrorCodes } from '../../commons/erros/http-error-codes.constant';
import { MatchModel } from '../models/match.model';
import { MessageModel } from '../models/message.model';
import { UserModel } from '../models/user.model';
import { SendChatMessageDto } from './dto/send-chat-message.dto';

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

    const existMatch = await this.matchModel.model
      .findOne({
        _id: _matchId,
        $or: [{ _userOneId: _currentUserId }, { _userTwoId: _currentUserId }],
      })
      .lean()
      .exec();

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
}
