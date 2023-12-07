import { Injectable } from '@nestjs/common';

import { APP_CONFIG } from '../../app.config';
import { ApiCursorObjectIdService } from '../../commons';
import { Pagination } from '../../types';
import { ClientData } from '../auth/auth.type';
import { MatchModel } from '../models/match.model';
import { Match, MatchWithTargetProfile } from '../models/schemas/match.schema';
import { FindManyConversationsQuery } from './dto/find-many-conversations.dto';

@Injectable()
export class ConversationsService extends ApiCursorObjectIdService {
  constructor(private readonly matchModel: MatchModel) {
    super();
    this.limitRecordsPerQuery = APP_CONFIG.PAGINATION_LIMIT.CONVERSATIONS;
  }

  public async findMany(
    queryParams: FindManyConversationsQuery,
    clientData: ClientData,
  ): Promise<MatchWithTargetProfile[]> {
    const { _currentUserId, currentUserId } = this.getClient(clientData);
    const { _next } = queryParams;
    const cursor = _next ? this.getCursor(_next) : undefined;
    const findResults = await this.matchModel.findMany(
      {
        ...this.matchModel.queryUserOneOrUserTwo(_currentUserId),
        ...(cursor
          ? {
              'lastMessage.createdAt': {
                $lt: cursor,
              },
            }
          : { 'lastMessage.createdAt': { $ne: null } }),
      },
      {},
      {
        sort: { 'lastMessage.createdAt': -1 },
        limit: this.limitRecordsPerQuery,
      },
    );
    return this.matchModel.formatManyWithTargetProfile(
      findResults,
      currentUserId,
    );
  }

  public getPagination(
    data: Array<Match | MatchWithTargetProfile>,
  ): Pagination {
    const dataLength = data.length;
    if (!dataLength || dataLength < this.limitRecordsPerQuery) {
      return { _next: null };
    }
    const lastData = data[dataLength - 1];
    const lastField = lastData.lastMessage?.createdAt?.toString();
    return {
      _next: lastField ? this.encodeFromString(lastField) : null,
    };
  }
}
