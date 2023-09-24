import { BadRequestException, Injectable } from '@nestjs/common';
import _ from 'lodash';

import { ResponseSuccess } from '../../commons/dto/response.dto';
import { HttpErrorMessages } from '../../commons/erros/http-error-messages.constant';
import { PaginatedResponse } from '../../commons/types';
import { ClientData } from '../auth/auth.type';
import { ChatsGateway } from '../chats/chats.gateway';
import { LikeModel } from '../models/like.model';
import { MatchModel } from '../models/match.model';
import { Like, LikeDocument } from '../models/schemas/like.schema';
import { UserModel } from '../models/user.model';
import { FindManyLikedMeDto } from './dto/find-user-like-me.dto';
import { SendLikeDto } from './dto/send-like.dto';

@Injectable()
export class LikesService {
  constructor(
    private readonly likeModel: LikeModel,
    private readonly userModel: UserModel,
    private readonly chatsGateway: ChatsGateway,
    private readonly matchModel: MatchModel,
  ) {}

  public async send(
    payload: SendLikeDto,
    clientData: ClientData,
  ): Promise<ResponseSuccess> {
    const currentUserId = clientData.id;
    const { targetUserId } = payload;

    if (currentUserId === targetUserId) {
      throw new BadRequestException({
        message: HttpErrorMessages['You cannot like yourself!'],
      });
    }

    const _currentUserId = this.userModel.getObjectId(currentUserId);
    const _targetUserId = this.userModel.getObjectId(targetUserId);

    const existLike = await this.likeModel.model.findOne({
      _userId: _currentUserId,
      _targetUserId,
    });

    if (existLike) {
      return { success: true };
    }

    const reverseLike = await this.likeModel.model.findOne({
      _userId: _targetUserId,
      _targetUserId: _currentUserId,
    });

    await this.likeModel.model.create({
      _userId: _currentUserId,
      _targetUserId,
      ...(reverseLike ? { isMatched: true } : {}),
    });

    if (reverseLike) {
      const { _userOneId, _userTwoId } = this.matchModel.getSortedUserIds({
        currentUserId,
        targetUserId,
      });

      const createMatch = await this.matchModel.model.create({
        _userOneId,
        _userTwoId,
      });

      this.chatsGateway.server
        .to([currentUserId, targetUserId])
        .emit('matched', createMatch.toJSON());
    }

    return { success: true };
  }

  public async findManyLikedMe(
    queryParams: FindManyLikedMeDto,
    clientData: ClientData,
  ): Promise<PaginatedResponse<Like>> {
    const { id: currentUserId } = clientData;
    const _currentUserId = this.userModel.getObjectId(currentUserId);
    const { _next, _prev } = queryParams;
    const cursor = _next || _prev;

    const findResults: LikeDocument[] = await this.likeModel.model
      .aggregate([
        {
          $match: {
            _targetUserId: _currentUserId,
            isMatched: false,
            ...(cursor
              ? {
                  _id: {
                    [_next ? '$lt' : '$gt']: this.likeModel.getObjectId(cursor),
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
        { $limit: 20 },
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
      pagination: {
        _next: _.last(findResults)?._id?.toString() || null,
      },
    };
  }
}
