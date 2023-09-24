import { Injectable } from '@nestjs/common';
import _ from 'lodash';

import { APP_CONFIG } from '../../app.config';
import { ResponseSuccess } from '../../commons/dto/response.dto';
import { ApiService } from '../../commons/services/api.service';
import { PaginatedResponse, Pagination } from '../../commons/types';
import { ClientData } from '../auth/auth.type';
import { ChatsGateway } from '../chats/chats.gateway';
import { MatchModel } from '../models/match.model';
import { MessageModel } from '../models/message.model';
import { LikeDocument } from '../models/schemas/like.schema';
import { Match, MatchDocument } from '../models/schemas/match.schema';
import { UserModel } from '../models/user.model';
import { FindManyMatchesQuery } from './dto/find-matches-relationships.dto';

@Injectable()
export class MatchesService extends ApiService {
  constructor(
    private readonly matchModel: MatchModel,
    private readonly userModel: UserModel,
    private readonly messageModel: MessageModel,
    private readonly chatsGateway: ChatsGateway,
  ) {
    super();

    this.limitRecordsPerQuery = APP_CONFIG.PAGINATION_LIMIT.MATCHES;
  }

  public async cancel(
    id: string,
    clientData: ClientData,
  ): Promise<ResponseSuccess> {
    const _id = this.getObjectId(id);
    const { id: currentUserId } = clientData;
    const _currentUserId = this.getObjectId(currentUserId);

    const deleteResult = await this.matchModel.model.deleteOne({
      _id,
      $or: [{ _userOneId: _currentUserId }, { _userTwoId: _currentUserId }],
    });

    // TODO: socket to users

    return { success: !!deleteResult.deletedCount };
  }

  public async findMatched(
    queryParams: FindManyMatchesQuery,
    clientData: ClientData,
  ): Promise<PaginatedResponse<Match>> {
    const { id: currentUserId } = clientData;
    const _currentUserId = this.getObjectId(currentUserId);
    const { _next } = queryParams;
    const cursor = this.decodeToString(_next);

    const findResults: LikeDocument[] = await this.matchModel.model
      .aggregate([
        {
          $match: {
            lastMessageAt: null,
            ...(cursor
              ? {
                  _id: {
                    $lt: this.getObjectId(cursor),
                  },
                }
              : {}),
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
        { $limit: APP_CONFIG.PAGINATION_LIMIT.MATCHES },
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
                $lookup: {
                  from: 'mediafiles',
                  let: { userId: '$_id' },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$_userId', '$$userId'],
                        },
                      },
                    },
                    { $limit: APP_CONFIG.PAGINATION_LIMIT.MEDIA_FILES },
                    {
                      $project: {
                        _id: true,
                        location: true,
                      },
                    },
                  ],
                  as: 'mediaFiles',
                },
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
            read: false,
          },
        },
      ])
      .exec();

    return {
      type: 'matches',
      data: findResults,
      pagination: {
        _next: _.last(findResults)?._id?.toString() || null,
      },
    };
  }

  public getPagination(data: MatchDocument[]): Pagination {
    return this.getPaginationByField(data, '_id');
  }
}
