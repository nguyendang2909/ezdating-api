import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { APP_CONFIG } from '../../app.config';
import { ApiCursorObjectIdService } from '../../commons';
import { PaginatedResponse, Pagination } from '../../commons/types';
import { ClientData } from '../auth/auth.type';
import { MatchModel } from '../models/match.model';
import { MessageModel } from '../models/message.model';
import { Match, MatchDocument } from '../models/schemas/match.schema';
import { UserModel } from '../models/user.model';
import { FindManyConversationsQuery } from './dto/find-many-conversations.dto';

@Injectable()
export class ConversationsService extends ApiCursorObjectIdService {
  constructor(
    private readonly matchModel: MatchModel,
    private readonly userModel: UserModel,
    private readonly messageModel: MessageModel,
  ) {
    super();
    this.limitRecordsPerQuery = APP_CONFIG.PAGINATION_LIMIT.CONVERSATIONS;
  }

  public async findMany(
    queryParams: FindManyConversationsQuery,
    clientData: ClientData,
  ): Promise<
    PaginatedResponse<MatchDocument | (Match & { _id: Types.ObjectId })>
  > {
    const { id: currentUserId } = clientData;
    const _currentUserId = this.getObjectId(currentUserId);
    const { _next } = queryParams;
    const cursor = _next ? this.getCursor(_next) : undefined;

    const findResults = await this.matchModel.aggregate([
      {
        $match: {
          $or: [
            {
              _userOneId: _currentUserId,
            },
            {
              _userTwoId: _currentUserId,
            },
          ],
          ...(cursor
            ? {
                'lastMessage._id': {
                  $lt: cursor,
                },
              }
            : { lastMessage: { $ne: null } }),
        },
      },
      {
        $sort: { _lastMessageId: -1 },
      },
      { $limit: this.limitRecordsPerQuery },
      {
        $set: {
          isUserOne: {
            $cond: {
              if: {
                $eq: ['$_userOneId', _currentUserId],
              },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          let: {
            targetUserId: {
              $cond: {
                if: {
                  $eq: ['$isUserOne', true],
                },
                then: '$_userTwoId',
                else: '$_userOneId',
              },
            },
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$targetUserId'],
                },
              },
            },
            {
              $limit: 1,
            },
            {
              $set: {
                age: {
                  $dateDiff: {
                    startDate: '$birthday',
                    endDate: '$$NOW',
                    unit: 'year',
                  },
                },
              },
            },
            {
              $project: {
                _id: true,
                age: 1,
                filterGender: true,
                filterMaxAge: true,
                filterMaxDistance: true,
                filterMinAge: true,
                gender: true,
                introduce: true,
                lastActivatedAt: true,
                mediaFiles: true,
                nickname: true,
                relationshipGoal: true,
                status: true,
              },
            },
          ],
          as: 'targetUser',
        },
      },
      {
        $set: {
          targetUser: { $first: '$targetUser' },
          read: {
            $cond: {
              if: {
                $eq: ['$isUserOne', true],
              },
              then: '$userOneRead',
              else: '$userTwoRead',
            },
          },
        },
      },
    ]);
    return {
      type: 'conversations',
      data: findResults,
      pagination: this.getPagination(findResults),
    };
  }

  public getPagination(
    data: Array<MatchDocument | (Match & { _id: Types.ObjectId })>,
  ): Pagination {
    const dataLength = data.length;
    if (!dataLength || dataLength < this.limitRecordsPerQuery) {
      return { _next: null };
    }
    const lastData = data[dataLength - 1];
    const lastField = lastData.lastMessage?._id?.toString();
    return {
      _next: lastField ? this.encodeFromString(lastField) : null,
    };
  }
}
