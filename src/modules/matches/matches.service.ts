import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

import { APP_CONFIG } from '../../app.config';
import { SOCKET_TO_CLIENT_EVENTS } from '../../commons/constants';
import { HttpErrorMessages } from '../../commons/erros/http-error-messages.constant';
import { ApiCursorDateService } from '../../commons/services/api-cursor-date.service';
import { PaginatedResponse, Pagination } from '../../commons/types';
import { ClientData } from '../auth/auth.type';
import { ChatsGateway } from '../chats/chats.gateway';
import { LikeModel } from '../models/like.model';
import { MatchModel } from '../models/match.model';
import { LikeDocument } from '../models/schemas/like.schema';
import { Match, MatchDocument } from '../models/schemas/match.schema';
import { UserModel } from '../models/user.model';
import { ViewModel } from '../models/view.model';
import { CreateMatchDto } from './dto/create-match.dto';
import { FindManyMatchesQuery } from './dto/find-matches-relationships.dto';

@Injectable()
export class MatchesService extends ApiCursorDateService {
  constructor(
    private readonly matchModel: MatchModel,
    private readonly userModel: UserModel,
    private readonly chatsGateway: ChatsGateway,
    private readonly likeModel: LikeModel,
    private readonly viewModel: ViewModel,
  ) {
    super();

    this.limitRecordsPerQuery = APP_CONFIG.PAGINATION_LIMIT.MATCHES;
  }

  public async createOne(payload: CreateMatchDto, clientData: ClientData) {
    const { targetUserId } = payload;
    const { id: currentUserId } = clientData;
    const { _userOneId, _userTwoId } = this.matchModel.getSortedUserIds({
      currentUserId,
      targetUserId,
    });
    const existMatch = await this.findOneByUserIds({
      _userOneId,
      _userTwoId,
    });
    if (existMatch) {
      return existMatch;
    }
    await this.matchModel.createOne({
      _userOneId,
      _userTwoId,
    });
    const match = await this.findOneByUserIds({
      _userOneId,
      _userTwoId,
    });
    if (!match) {
      throw new NotFoundException(HttpErrorMessages['Match does not exist']);
    }
    this.chatsGateway.server
      .to([currentUserId, targetUserId])
      .emit(SOCKET_TO_CLIENT_EVENTS.MATCH, match);
    return match;
  }

  public async cancel(id: string, clientData: ClientData) {
    const _id = this.getObjectId(id);
    const { id: currentUserId } = clientData;
    const _currentUserId = this.getObjectId(currentUserId);
    const existMatch = await this.matchModel.findOneOrFail(
      {
        _id,
        $or: [{ _userOneId: _currentUserId }, { _userTwoId: _currentUserId }],
      },
      {
        _id: true,
        _userOneId: true,
        _userTwoId: true,
      },
      { lean: true },
    );
    await this.matchModel.deleteOneOrFail({
      _id,
      $or: [{ _userOneId: _currentUserId }, { _userTwoId: _currentUserId }],
    });

    this.handleAfterUnmatch({
      currentUserId,
      userOneId: existMatch._userOneId.toString(),
      userTwoId: existMatch._userOneId.toString(),
      _currentUserId,
      matchId: existMatch._id.toString(),
    });
    return {
      _id: existMatch._id,
    };
  }

  public async findMany(
    queryParams: FindManyMatchesQuery,
    clientData: ClientData,
  ): Promise<PaginatedResponse<Match>> {
    const { id: currentUserId } = clientData;
    const _currentUserId = this.getObjectId(currentUserId);
    const { _next } = queryParams;
    const cursor = _next ? this.getCursor(_next) : undefined;

    const findResults: MatchDocument[] = await this.matchModel.model
      .aggregate([
        {
          $match: {
            lastMessageAt: null,
            ...(cursor
              ? {
                  createdAt: {
                    $lt: cursor,
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
                $project: this.userModel.matchUserFields,
              },
            ],
            as: 'targetUser',
          },
        },
        {
          $set: {
            targetUser: { $first: '$targetUser' },
          },
        },
      ])
      .exec();

    return {
      type: 'matches',
      data: findResults,
      pagination: this.getPagination(findResults),
    };
  }

  public getPagination(data: MatchDocument[]): Pagination {
    return this.getPaginationByField(data, '_id');
  }

  public async findOneOrFailById(id: string, client: ClientData) {
    const { id: currentUserId } = client;
    const _currentUserId = this.getObjectId(currentUserId);

    const matches: LikeDocument[] = await this.matchModel.model
      .aggregate([
        {
          $match: {
            _id: this.getObjectId(id),
            $or: [
              {
                _userOneId: _currentUserId,
              },
              {
                _userTwoId: _currentUserId,
              },
            ],
          },
        },
        { $limit: 1 },
        {
          $lookup: {
            from: 'users',
            let: {
              targetUserId: '$_userOneId',
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
                $project: this.userModel.matchUserFields,
              },
            ],
            as: 'userOne',
          },
        },
        {
          $lookup: {
            from: 'users',
            let: {
              targetUserId: '$_userTwoId',
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
                $project: this.userModel.matchUserFields,
              },
            ],
            as: 'userTwo',
          },
        },
        {
          $set: {
            userOne: { $first: '$userOne' },
            userTwo: { $first: '$userTwo' },
          },
        },
      ])
      .exec();

    const match = matches[0];
    if (!match) {
      throw new NotFoundException(HttpErrorMessages['Match does not exist']);
    }
    return match;
  }

  public async findOneByUserIds({
    _userOneId,
    _userTwoId,
  }: {
    _userOneId: Types.ObjectId;
    _userTwoId: Types.ObjectId;
  }) {
    const matches: LikeDocument[] = await this.matchModel.model
      .aggregate([
        {
          $match: {
            _userOneId,
            _userTwoId,
          },
        },
        { $limit: 1 },
        {
          $lookup: {
            from: 'users',
            pipeline: [
              {
                $match: {
                  _id: _userOneId,
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
                $project: this.userModel.matchUserFields,
              },
            ],
            as: 'userOne',
          },
        },
        {
          $lookup: {
            from: 'users',
            pipeline: [
              {
                $match: {
                  _id: _userTwoId,
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
                $project: this.userModel.matchUserFields,
              },
            ],
            as: 'userTwo',
          },
        },
        {
          $set: {
            userOne: { $first: '$userOne' },
            userTwo: { $first: '$userTwo' },
          },
        },
      ])
      .exec();

    return matches[0];
  }

  async handleAfterUnmatch({
    currentUserId,
    userOneId,
    userTwoId,
    _currentUserId,
    matchId,
  }: {
    _currentUserId: Types.ObjectId;
    currentUserId: string;
    matchId: string;
    userOneId: string;
    userTwoId: string;
  }) {
    const { _targetUserId } = this.matchModel.getTargetUserId({
      currentUserId,
      userOneId,
      userTwoId,
    });
    this.likeModel.deleteOne({
      _userId: _currentUserId,
      _targetUserId,
    });
    this.likeModel.updateOne(
      {
        _userId: _targetUserId,
        _targetUserId: _currentUserId,
      },
      {
        $set: {
          isMatched: false,
        },
      },
    );
    this.chatsGateway.server
      .to([userOneId, userTwoId])
      .emit(SOCKET_TO_CLIENT_EVENTS.CANCEL_MATCHED, {
        _id: matchId,
      });
  }
}
