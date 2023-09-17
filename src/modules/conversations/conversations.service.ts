import { Injectable, NotFoundException } from '@nestjs/common';
import moment from 'moment';

import { HttpErrorMessages } from '../../commons/erros/http-error-messages.constant';
import { ClientData } from '../auth/auth.type';
import { MatchModel } from '../models/match.model';
import { MessageModel } from '../models/message.model';
import { UserModel } from '../models/user.model';
import { FindManyConversationsQuery } from './dto/find-many-conversations.dto';

@Injectable()
export class ConversationsService {
  constructor(
    private readonly matchModel: MatchModel,
    private readonly userModel: UserModel,
    private readonly messageModel: MessageModel,
  ) {}

  public async findMany(
    queryParams: FindManyConversationsQuery,
    clientData: ClientData,
  ) {
    const { id: currentUserId } = clientData;
    const _currentUserId = this.userModel.getObjectId(currentUserId);
    const { _next, _prev } = queryParams;
    const cursor = _next || _prev;

    const findResult = await this.matchModel.model.aggregate([
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
                lastMessageAt: {
                  [_next ? '$lt' : '$gt']: moment(cursor).toDate(),
                },
              }
            : { lastMessageAt: { $ne: null } }),
        },
      },
      {
        $sort: { lastMessageAt: -1 },
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
      data: findResult,
    };
  }

  public async findOneOrFailById(id: string, clientData: ClientData) {
    const { id: currentUserId } = clientData;
    const _id = this.matchModel.getObjectId(id);
    const _currentUserId = this.userModel.getObjectId(currentUserId);

    const findResult = await this.matchModel.model.aggregate([
      {
        $match: {
          _id,
          $or: [{ _userOneId: _currentUserId }, { _userTwoId: _currentUserId }],
        },
      },
      {
        $limit: 1,
      },
      {
        $lookup: {
          from: 'users',
          let: {
            targetUserId: {
              $cond: {
                if: {
                  $eq: ['$_userOneId', _currentUserId],
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
    ]);

    if (!findResult) {
      throw new NotFoundException({
        message: HttpErrorMessages['Conversation does not exist!'],
      });
    }

    return findResult;
  }
}
