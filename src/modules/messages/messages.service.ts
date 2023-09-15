import { BadRequestException, Injectable } from '@nestjs/common';
import moment from 'moment';

import { HttpErrorCodes } from '../../commons/erros/http-error-codes.constant';
import { ClientData } from '../auth/auth.type';
import { MatchModel } from '../models/match.model';
import { MessageModel } from '../models/message.model';
import { UserModel } from '../models/user.model';
import { FindManyMessagesQuery } from './dto/find-many-messages.dto';

@Injectable()
export class MessagesService {
  constructor(
    private readonly matchModel: MatchModel,
    private readonly userModel: UserModel,
    private readonly messageModel: MessageModel,
  ) {}

  public async findMany(
    queryParams: FindManyMessagesQuery,
    clientData: ClientData,
  ) {
    const { matchId, _next, _prev } = queryParams;
    const cursor = _next || _prev;
    const _matchId = this.matchModel.getObjectId(matchId);
    const { id: currentUserId } = clientData;
    const _currentUserId = this.userModel.getObjectId(currentUserId);

    const existMatch = await this.matchModel.model.findOne({
      _id: _matchId,
      $or: [{ _userOneId: _currentUserId }, { _userTwoId: _currentUserId }],
    });

    if (!existMatch) {
      throw new BadRequestException({
        errorCode: HttpErrorCodes.CONVERSATION_DOES_NOT_EXIST,
        message: 'Conversation does not exist!',
      });
    }

    const { _userOneId, _userTwoId } = existMatch;

    if (!_userOneId || !_userTwoId) {
      throw new BadRequestException({
        errorCode: HttpErrorCodes.CONVERSATION_IS_INVALID,
        message: 'Conversation is invalid!',
      });
    }

    const findResult = await this.messageModel.model
      .find(
        {
          _matchId,
          ...(cursor
            ? {
                createdAt: {
                  [_next ? '$lt' : '$gt']: moment(cursor).toDate(),
                },
              }
            : {}),
        },
        {},
      )
      .sort({ createdAt: -1 })
      .limit(25)
      .lean()
      .exec();

    const isUserOne = currentUserId === _userOneId.toString();

    await this.matchModel.model.updateOne(
      { _id: _matchId },
      {
        $set: {
          ...(isUserOne ? { userOneRead: true } : { userTwoRead: true }),
        },
      },
    );

    return {
      type: 'messages',
      _matchId: matchId,
      data: findResult,
    };
  }
}
