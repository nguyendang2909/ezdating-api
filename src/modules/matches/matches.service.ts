import { Injectable } from '@nestjs/common';
import moment from 'moment';

import { ResponseSuccess } from '../../commons/dto/response.dto';
import { ClientData } from '../auth/auth.type';
import { ChatsGateway } from '../chats/chats.gateway';
import { MatchModel } from '../models/match.model';
import { MessageModel } from '../models/message.model';
import { UserModel } from '../models/user.model';
import { FindManyMatchesQuery } from './dto/find-matches-relationships.dto';

@Injectable()
export class MatchesService {
  constructor(
    private readonly matchModel: MatchModel,
    private readonly userModel: UserModel,
    private readonly messageModel: MessageModel,
    private readonly chatsGateway: ChatsGateway,
  ) {}

  public async cancel(
    id: string,
    clientData: ClientData,
  ): Promise<ResponseSuccess> {
    const _id = this.matchModel.getObjectId(id);
    const { id: currentUserId } = clientData;
    const _currentUserId = this.userModel.getObjectId(currentUserId);

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
  ) {
    const { id: currentUserId } = clientData;
    const _currentUserId = this.userModel.getObjectId(currentUserId);
    const { _next, _prev } = queryParams;
    const cursor = _next || _prev;

    const findResult = await this.matchModel.model
      .aggregate([
        {
          $match: {
            lastMessageAt: null,
            ...(cursor
              ? {
                  matchedAt: {
                    [_next ? '$lt' : '$gt']: moment(cursor).toDate(),
                  },
                }
              : {}),
          },
        },
        {
          $sort: {
            matchedAt: -1,
          },
        },
        { $limit: 20 },
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
                    { $limit: 6 },
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
      data: findResult,
    };
  }
}
