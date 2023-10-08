import { Injectable } from '@nestjs/common';

import { APP_CONFIG } from '../../app.config';
import { ApiCursorDateService } from '../../commons/services/api-cursor-date.service';
import { PaginatedResponse, Pagination } from '../../commons/types';
import { ClientData } from '../auth/auth.type';
import { MatchModel } from '../models/match.model';
import { MessageModel } from '../models/message.model';
import { MatchDocument } from '../models/schemas/match.schema';
import { UserModel } from '../models/user.model';
import { FindManyConversationsQuery } from './dto/find-many-conversations.dto';

@Injectable()
export class ConversationsService extends ApiCursorDateService {
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
  ): Promise<PaginatedResponse<MatchDocument>> {
    const { id: currentUserId } = clientData;
    const _currentUserId = this.getObjectId(currentUserId);
    const { _next } = queryParams;
    const cursor = _next ? this.getCursor(_next) : undefined;

    const findResults: MatchDocument[] = await this.matchModel.model.aggregate([
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
                  $lt: cursor,
                },
              }
            : { lastMessageAt: { $ne: null } }),
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

  // public async findOneOrFailById(id: string, clientData: ClientData) {
  //   const { id: currentUserId } = clientData;
  //   const _id = this.getObjectId(id);
  //   const _currentUserId = this.getObjectId(currentUserId);
  //   const findResult = await this.matchModel.model.aggregate([
  //     {
  //       $match: {
  //         _id,
  //         $or: [{ _userOneId: _currentUserId }, { _userTwoId: _currentUserId }],
  //       },
  //     },
  //     {
  //       $limit: 1,
  //     },
  //     {
  //       $lookup: {
  //         from: 'users',
  //         let: {
  //           targetUserId: {
  //             $cond: {
  //               if: {
  //                 $eq: ['$_userOneId', _currentUserId],
  //               },
  //               then: '$_userTwoId',
  //               else: '$_userOneId',
  //             },
  //           },
  //         },
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: {
  //                 $eq: ['$_id', '$$targetUserId'],
  //               },
  //             },
  //           },
  //           {
  //             $limit: 1,
  //           },
  //           {
  //             $lookup: {
  //               from: 'mediafiles',
  //               let: { userId: '$_id' },
  //               pipeline: [
  //                 {
  //                   $match: {
  //                     $expr: {
  //                       $eq: ['$_userId', '$$userId'],
  //                     },
  //                   },
  //                 },
  //                 { $limit: APP_CONFIG.PAGINATION_LIMIT.MEDIA_FILES },
  //                 {
  //                   $project: {
  //                     _id: true,
  //                     location: true,
  //                   },
  //                 },
  //               ],
  //               as: 'mediaFiles',
  //             },
  //           },
  //           {
  //             $set: {
  //               age: {
  //                 $dateDiff: {
  //                   startDate: '$birthday',
  //                   endDate: '$$NOW',
  //                   unit: 'year',
  //                 },
  //               },
  //             },
  //           },
  //           {
  //             $project: {
  //               _id: true,
  //               age: 1,
  //               filterGender: true,
  //               filterMaxAge: true,
  //               filterMaxDistance: true,
  //               filterMinAge: true,
  //               gender: true,
  //               introduce: true,
  //               lastActivatedAt: true,
  //               mediaFiles: true,
  //               nickname: true,
  //               relationshipGoal: true,
  //               status: true,
  //             },
  //           },
  //         ],
  //         as: 'targetUser',
  //       },
  //     },
  //   ]);
  //   if (!findResult) {
  //     throw new NotFoundException({
  //       message: HttpErrorMessages['Conversation does not exist.'],
  //     });
  //   }
  //   return findResult;
  // }

  public getPagination(data: MatchDocument[]): Pagination {
    return this.getPaginationByField(data, '_lastMessageId');
  }
}
