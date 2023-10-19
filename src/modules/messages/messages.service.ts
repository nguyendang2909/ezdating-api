import { Injectable } from '@nestjs/common';

import { APP_CONFIG } from '../../app.config';
import { ApiService } from '../../commons/services/api.service';
import { PaginatedResponse, Pagination } from '../../commons/types';
import { ClientData } from '../auth/auth.type';
import { MatchModel } from '../models/match.model';
import { MessageModel } from '../models/message.model';
import { MessageDocument } from '../models/schemas/message.schema';
import { UserModel } from '../models/user.model';
import { FindManyMessagesQuery } from './dto/find-many-messages.dto';

@Injectable()
export class MessagesService extends ApiService {
  constructor(
    private readonly matchModel: MatchModel,
    private readonly userModel: UserModel,
    private readonly messageModel: MessageModel,
  ) {
    super();

    this.limitRecordsPerQuery = APP_CONFIG.PAGINATION_LIMIT.MESSAGES;
  }

  public async findMany(
    queryParams: FindManyMessagesQuery,
    clientData: ClientData,
  ): Promise<PaginatedResponse<MessageDocument> & { _matchId: string }> {
    const { matchId, _next } = queryParams;
    const cursor = _next ? this.getCursor(_next) : undefined;
    const _matchId = this.getObjectId(matchId);
    const { id: currentUserId } = clientData;
    const _currentUserId = this.getObjectId(currentUserId);
    const { _userOneId } = await this.matchModel.findOneOrFail(
      {
        _id: _matchId,
        $or: [{ _userOneId: _currentUserId }, { _userTwoId: _currentUserId }],
      },
      {
        _userOneId: true,
        _userTwoId: true,
      },
    );
    const findResults = await this.messageModel.model
      .find(
        {
          _matchId,
          ...(cursor
            ? {
                createdAt: {
                  $lt: cursor,
                },
              }
            : {}),
        },
        {},
        {
          lean: true,
        },
      )
      .sort({ _id: -1 })
      .limit(this.limitRecordsPerQuery)
      .exec();
    const isUserOne = currentUserId === _userOneId.toString();
    await this.matchModel.updateOne(
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
      data: findResults,
      pagination: this.getPagination(findResults),
    };
  }

  public getPagination(data: MessageDocument[]): Pagination {
    return this.getPaginationByField(data, '_id');
  }
}
