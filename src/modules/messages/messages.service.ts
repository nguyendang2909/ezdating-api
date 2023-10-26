import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { APP_CONFIG } from '../../app.config';
import { ApiService } from '../../commons/services/api.service';
import { PaginatedResponse, Pagination } from '../../types';
import { ClientData } from '../auth/auth.type';
import { Match } from '../models';
import { MatchModel } from '../models/match.model';
import { MessageModel } from '../models/message.model';
import { MessageDocument } from '../models/schemas/message.schema';
import { UserModel } from '../models/user.model';
import { ReadMessageDto } from './dto';
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

  public async read(payload: ReadMessageDto, client: ClientData) {
    const { _currentUserId } = this.getClient(client);
    const { matchId, lastMessageId } = payload;
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

  public async findMany(
    queryParams: FindManyMessagesQuery,
    clientData: ClientData,
  ): Promise<PaginatedResponse<MessageDocument> & { _matchId: string }> {
    const { matchId, _next } = queryParams;
    const cursor = _next ? this.getCursor(_next) : undefined;
    const _matchId = this.getObjectId(matchId);
    const { id: currentUserId } = clientData;
    const _currentUserId = this.getObjectId(currentUserId);
    const existMatch = await this.matchModel.findOneOrFail({
      _id: _matchId,
      $or: [{ _userOneId: _currentUserId }, { _userTwoId: _currentUserId }],
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
        lean: true,
      },
    );

    this.handleAfterFindManyMessages({
      _matchId,
      currentUserId,
      match: existMatch,
    });

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
