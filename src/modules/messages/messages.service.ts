import { BadRequestException, Injectable } from '@nestjs/common';
import _ from 'lodash';

import { HttpErrorCodes } from '../../commons/erros/http-error-codes.constant';
import { ClientData } from '../auth/auth.type';
import { MatchModel } from '../models/match.model';
import { MessageModel } from '../models/message.model';
import { UserModel } from '../models/user.model';
import { FindManyMessagesDto } from './dto/find-many-messages.dto';

@Injectable()
export class MessagesService {
  constructor(
    private readonly matchModel: MatchModel,
    private readonly userModel: UserModel,
    private readonly messageModel: MessageModel,
  ) {}

  public async findMany(
    queryParams: FindManyMessagesDto,
    clientData: ClientData,
  ) {
    const { matchId } = queryParams;
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

    const { before, after } = queryParams;
    const cursor = this.matchModel.extractCursor(after || before);
    const cursorValue = cursor ? new Date(cursor) : undefined;

    const findResult = await this.messageModel.model
      .find(
        {
          _matchId,
          ...(cursorValue
            ? {
                createdAt: {
                  [after ? '$lt' : '$gt']: cursorValue,
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
        ...(isUserOne ? { userOneRead: true } : { userTwoRead: true }),
      },
    );

    return {
      type: 'messages',
      _matchId: matchId,
      data: findResult,
      pagination: {
        cursors: this.messageModel.getCursors({
          after: _.last(findResult)?.createdAt?.toString(),
          before: _.first(findResult)?.createdAt?.toString(),
        }),
      },
    };
  }
}
