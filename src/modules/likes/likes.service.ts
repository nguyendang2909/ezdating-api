import { BadRequestException, Injectable, Logger } from '@nestjs/common';
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

  private readonly logger = new Logger(LikesService.name);

  public async send(
    payload: SendLikeDto,
    clientData: ClientData,
  ): Promise<void> {
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
      this.logger.log(
        `SEND_LIKE Exist like found ${JSON.stringify(existLike)}`,
      );
      return;
    }
    const reverseLikeFilter = {
      _userId: _targetUserId,
      _targetUserId: _currentUserId,
    };
    const reverseLikeUpdatePayload = {
      $set: {
        isMatched: true,
      },
    };
    this.logger.log(
      `SEND_LIKE Find one and update reverse like filter ${JSON.stringify(
        reverseLikeFilter,
      )} payload: ${JSON.stringify(reverseLikeUpdatePayload)}`,
    );
    const reverseLike = await this.likeModel.model
      .findOneAndUpdate(reverseLikeFilter, reverseLikeUpdatePayload)
      .exec();
    const createPayload = {
      _userId: _currentUserId,
      _targetUserId,
      ...(reverseLike ? { isMatched: true } : {}),
    };
    this.logger.log(
      `SEND_LIKE Exist like not found, start create like payload ${JSON.stringify(
        createPayload,
      )}`,
    );
    await this.likeModel.createOne(createPayload);
    this.handleAfterSendLike({
      _currentUserId,
      _targetUserId,
      hasReverseLike: !!reverseLike,
      currentUserId,
      targetUserId,
    });

    return;
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
    const updateViewFilter = { _userId: _currentUserId, _targetUserId };
    const updateViewPayload = {
      isLiked: true,
      ...(hasReverseLike ? { isMatched: true } : {}),
    };
    const updateViewOptions = { upsert: true };
    this.logger.debug(
      `CREATE_LIKE Update view filter ${JSON.stringify(
        updateViewFilter,
      )} payload: ${JSON.stringify(updateViewPayload)} options ${JSON.stringify(
        updateViewOptions,
      )}`,
    );
    this.viewModel
      .updateOne(updateViewFilter, updateViewPayload, updateViewOptions)
      .catch((error) => {
        this.logger.error(
          `CREATE_LIKE Update view filter ${JSON.stringify(
            updateViewFilter,
          )} payload: ${JSON.stringify(
            updateViewPayload,
          )} options ${JSON.stringify(updateViewOptions)} error: ${error}`,
        );
      });
    if (hasReverseLike) {
      const { _userOneId, _userTwoId } = this.matchModel.getSortedUserIds({
        currentUserId,
        targetUserId,
      });
      const createMatchPayload = { _userOneId, _userTwoId };
      this.logger.log(
        `CREATE_LIKE Create match payload: ${JSON.stringify(
          createMatchPayload,
        )}`,
      );
      const createMatch = await this.matchModel.createOne(createMatchPayload);
      const emitUserIds = [currentUserId, targetUserId];
      const [userOne, userTwo] = await this.userModel.findMany(
        {
          _id: { $in: [_userOneId, _userTwoId] },
        },
        this.userModel.matchUserFields,
        {
          sort: {
            _id: 1,
          },
          limit: 2,
        },
      );
      const emitPayload = {
        ...createMatch.toJSON(),
        userOne,
        userTwo,
      };
      this.logger.log(
        `CREATE_LIKE Socket emit event "${
          SOCKET_TO_CLIENT_EVENTS.MATCH
        }" userIds: ${JSON.stringify(emitUserIds)} payload: ${JSON.stringify(
          emitPayload,
        )}`,
      );
      this.chatsGateway.server
        .to(emitUserIds)
        .emit(SOCKET_TO_CLIENT_EVENTS.MATCH, emitPayload);
    }
  }

  public verifyNotSameUserById(userOne: string, userTwo: string) {
    if (userOne === userTwo) {
      throw new BadRequestException({
        message: HttpErrorMessages['You cannot like yourself'],
      });
    }
  }
}
