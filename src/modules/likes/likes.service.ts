import { BadRequestException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { APP_CONFIG } from '../../app.config';
import { HttpErrorMessages } from '../../commons/erros/http-error-messages.constant';
import { ApiCursorDateService } from '../../commons/services/api-cursor-date.service';
import { PaginatedResponse, Pagination } from '../../commons/types';
import { ClientData } from '../auth/auth.type';
import { ChatsGateway } from '../chats/chats.gateway';
import { LikeModel } from '../models/like.model';
import { MatchModel } from '../models/match.model';
import { Like, LikeDocument } from '../models/schemas/like.schema';
import { UserModel } from '../models/user.model';
import { ViewModel } from '../models/view.model';
import { FindManyLikedMeDto } from './dto/find-user-like-me.dto';
import { SendLikeDto } from './dto/send-like.dto';

@Injectable()
export class LikesService extends ApiCursorDateService {
  constructor(
    private readonly likeModel: LikeModel,
    private readonly userModel: UserModel,
    private readonly chatsGateway: ChatsGateway,
    private readonly matchModel: MatchModel,
    private readonly viewModel: ViewModel,
  ) {
    super();

    this.limitRecordsPerQuery = APP_CONFIG.PAGINATION_LIMIT.LIKES;
  }

  public async send(payload: SendLikeDto, clientData: ClientData) {
    const currentUserId = clientData.id;
    const { targetUserId } = payload;
    this.verifyNotSameUserById(currentUserId, targetUserId);
    const _currentUserId = this.getObjectId(currentUserId);
    const _targetUserId = this.getObjectId(targetUserId);
    const existLike = await this.likeModel.findOne({
      _userId: _currentUserId,
      _targetUserId,
    });
    if (existLike) {
      return existLike;
    }
    const reverseLike = await this.likeModel.model
      .findOneAndUpdate(
        {
          _userId: _targetUserId,
          _targetUserId: _currentUserId,
        },
        {
          $set: {
            isMatched: true,
          },
        },
      )
      .exec();
    await this.likeModel.createOne({
      _userId: _currentUserId,
      _targetUserId,
      ...(reverseLike ? { isMatched: true } : {}),
    });
    this.handleAfterSendLike({
      _currentUserId,
      _targetUserId,
      hasReverseLike: !!reverseLike,
      currentUserId,
      targetUserId,
    });

    return existLike;
  }

  public async findManyLikedMe(
    queryParams: FindManyLikedMeDto,
    clientData: ClientData,
  ): Promise<PaginatedResponse<Like>> {
    const { id: currentUserId } = clientData;
    const _currentUserId = this.getObjectId(currentUserId);
    const { _next } = queryParams;
    const cursor = _next ? this.getCursor(_next) : undefined;

    const findResults: LikeDocument[] = await this.likeModel.model
      .aggregate([
        {
          $match: {
            _targetUserId: _currentUserId,
            isMatched: false,
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
        { $limit: this.limitRecordsPerQuery },
        {
          $lookup: {
            from: 'users',
            let: {
              userId: '$_userId',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$_id', '$$userId'],
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
            as: 'users',
          },
        },
        {
          $project: {
            createdAt: true,
            user: {
              $first: '$users',
            },
          },
        },
      ])
      .exec();

    return {
      type: 'likedMe',
      data: findResults,
      pagination: this.getPagination(findResults),
    };
  }

  public getPagination(data: LikeDocument[]): Pagination {
    return this.getPaginationByField(data, '_id');
  }

  async handleAfterSendLike({
    _currentUserId,
    _targetUserId,
    hasReverseLike,
    currentUserId,
    targetUserId,
  }: {
    _currentUserId: Types.ObjectId;
    _targetUserId: Types.ObjectId;
    currentUserId: string;
    hasReverseLike: boolean;
    targetUserId: string;
  }) {
    this.viewModel.updateOne(
      { _userId: _currentUserId, _targetUserId },
      {
        isLiked: true,
        ...(hasReverseLike ? { isMatched: true } : {}),
      },
      { upsert: true },
    );
    if (hasReverseLike) {
      this.handleMatch({
        currentUserId,
        targetUserId,
      });
    }
  }
  async handleMatch({
    currentUserId,
    targetUserId,
  }: {
    currentUserId: string;
    targetUserId: string;
  }) {
    const { _userOneId, _userTwoId } = this.matchModel.getSortedUserIds({
      currentUserId,
      targetUserId,
    });
    const createMatch = await this.matchModel.createOne({
      _userOneId,
      _userTwoId,
    });
    this.chatsGateway.server
      .to([currentUserId, targetUserId])
      .emit('matched', createMatch);
  }

  public verifyNotSameUserById(userOne: string, userTwo: string) {
    if (userOne === userTwo) {
      throw new BadRequestException({
        message: HttpErrorMessages['You cannot like yourself'],
      });
    }
  }
}
