import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { APP_CONFIG } from '../../../app.config';
import { ApiReadService } from '../../../commons/services/api/api-read.base.service';
import { Pagination } from '../../../types';
import { PaginationCursorDateUtil } from '../../../utils';
import { ClientData } from '../../auth/auth.type';
import { Match } from '../../models';
import { MatchModel } from '../../models/match.model';
import { MessageModel } from '../../models/message.model';
import { Message } from '../../models/schemas/message.schema';
import { FindManyMessagesQuery } from '../dto/find-many-messages.dto';

@Injectable()
export class MessagesReadService extends ApiReadService<Message> {
  constructor(
    private readonly matchModel: MatchModel,
    private readonly messageModel: MessageModel,
    private readonly paginationUtil: PaginationCursorDateUtil,
  ) {
    super();

    this.limitRecordsPerQuery = APP_CONFIG.PAGINATION_LIMIT.MESSAGES;
  }

  public async findMany(
    queryParams: FindManyMessagesQuery,
    clientData: ClientData,
  ): Promise<Message[]> {
    const { matchId, _next } = queryParams;
    const cursor = _next ? this.paginationUtil.getCursor(_next) : undefined;
    const _matchId = this.getObjectId(matchId);
    const { _currentUserId, currentUserId } = this.getClient(clientData);
    const existMatch = await this.matchModel.findOneOrFail({
      _id: _matchId,
      ...this.matchModel.queryUserOneOrUserTwo(_currentUserId),
    });
    const findResults = await this.messageModel.findMany(
      {
        _matchId,
        ...(cursor ? { createdAt: { $lt: cursor } } : {}),
      },
      {},
      {
        sort: { createdAt: -1 },
        limit: this.limitRecordsPerQuery,
      },
    );
    this.handleAfterFindManyMessages({
      _matchId,
      currentUserId,
      match: existMatch,
    });
    return findResults;
  }

  public getPagination(data: Message[]): Pagination {
    return this.paginationUtil.getPaginationByField(
      data,
      'createdAt',
      this.limitRecordsPerQuery,
    );
  }

  async handleAfterFindManyMessages({
    _matchId,
    currentUserId,
    match,
  }: {
    _matchId: Types.ObjectId;
    currentUserId: string;
    match: Match;
  }) {
    const isUserOne = this.matchModel.isUserOne({
      currentUserId,
      userOneId: match.profileOne._id.toString(),
    });
    await this.matchModel.updateOne(
      { _id: _matchId },
      {
        $set: {
          ...(isUserOne ? { userOneRead: true } : { userTwoRead: true }),
        },
      },
    );
  }
}
