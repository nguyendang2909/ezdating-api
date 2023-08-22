import { Injectable } from '@nestjs/common';
import _ from 'lodash';

import { ResponseSuccess } from '../../commons/dto/response.dto';
import { ClientData } from '../auth/auth.type';
import { ChatsGateway } from '../chats/chats.gateway';
import { MatchModel } from '../models/match.model';
import { MessageModel } from '../models/message.model';
import { UserModel } from '../models/user.model';
import { FindMatchesDto } from './dto/find-matches-relationships.dto';

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
    queryParams: FindMatchesDto,
    clientData: ClientData,
  ) {
    const { id: currentUserId } = clientData;
    const _currentUserId = this.userModel.getObjectId(currentUserId);
    const { after, before } = queryParams;
    const cursor = this.matchModel.extractCursor(after || before);
    const cursorValue = cursor ? new Date(cursor) : undefined;

    const findResult = await this.matchModel.model
      .aggregate([
        {
          $match: {
            lastMessageAt: null,
            ...(cursorValue
              ? {
                  matchedAt: {
                    [after ? '$lt' : '$gt']: cursorValue,
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
                  nickname: true,
                  status: true,
                  lastActivatedAt: true,
                  age: 1,
                  filterGender: true,
                  filterMaxAge: true,
                  filterMaxDistance: true,
                  filterMinAge: true,
                  gender: true,
                  introduce: true,
                  lookingFor: true,
                  mediaFiles: true,
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
      pagination: {
        cursor: this.matchModel.getCursors({
          after: _.last(findResult)?.statusAt,
          before: _.first(findResult)?.statusAt,
        }),
      },
    };
  }
}
