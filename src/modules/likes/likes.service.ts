import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Types } from 'mongoose';

import { APP_CONFIG } from '../../app.config';
import { HttpErrorMessages } from '../../commons/erros/http-error-messages.constant';
import { ApiCursorDateService } from '../../commons/services/api-cursor-date.service';
import { SOCKET_TO_CLIENT_EVENTS } from '../../constants';
import {
  _CurrentTargetUserIds,
  PaginatedResponse,
  Pagination,
} from '../../types';
import { ClientData } from '../auth/auth.type';
import { ChatsGateway } from '../chats/chats.gateway';
import { MatchWithTargetUser, ProfileDocument, ProfileModel } from '../models';
import { LikeModel } from '../models/like.model';
import { MatchModel } from '../models/match.model';
import { Like, LikeDocument } from '../models/schemas/like.schema';
import { ViewModel } from '../models/view.model';
import { FindManyLikedMeDto } from './dto/find-user-like-me.dto';
import { SendLikeDto } from './dto/send-like.dto';

@Injectable()
export class LikesService extends ApiCursorDateService {
  constructor(
    private readonly likeModel: LikeModel,
    private readonly chatsGateway: ChatsGateway,
    private readonly matchModel: MatchModel,
    private readonly viewModel: ViewModel,
    private readonly profileModel: ProfileModel,
  ) {
    super();

    this.limitRecordsPerQuery = APP_CONFIG.PAGINATION_LIMIT.LIKES;
  }

  private readonly logger = new Logger(LikesService.name);

  public async send(
    payload: SendLikeDto,
    clientData: ClientData,
  ): Promise<void> {
    const { targetUserId } = payload;
    const { _currentUserId, currentUserId } = this.getClient(clientData);
    this.verifyNotSameUserById(currentUserId, targetUserId);
    const _targetUserId = this.getObjectId(targetUserId);
    const [profileOne, profileTwo] =
      await this.profileModel.findTwoOrFailMatchProfiles(
        _currentUserId,
        _targetUserId,
      );
    await this.verifyNotExistLike({ _currentUserId, _targetUserId });
    const reverseLike = await this.findOneAndUpdateReverseLike({
      _currentUserId,
      _targetUserId,
    });
    await this.createOne({ _targetUserId, _currentUserId, reverseLike });
    this.handleAfterSendLike({
      _currentUserId,
      _targetUserId,
      hasReverseLike: !!reverseLike,
      currentUserId,
      targetUserId,
      profileOne,
      profileTwo,
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
    profileOne,
    profileTwo,
  }: {
    _currentUserId: Types.ObjectId;
    _targetUserId: Types.ObjectId;
    currentUserId: string;
    hasReverseLike: boolean;
    profileOne: ProfileDocument;
    profileTwo: ProfileDocument;
    targetUserId: string;
  }) {
    if (hasReverseLike) {
      const createdMatch = await this.createMatch({ profileOne, profileTwo });
      const {
        // eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
        profileOne: profileOneTemp,
        // eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
        profileTwo: profileTwoTemp,
        ...restMatch
      } = createdMatch;
      this.emitMatchToUser(profileOne._id.toString(), {
        ...restMatch,
        targetProfile: profileTwo,
      });
      this.emitMatchToUser(profileTwo._id.toString(), {
        ...restMatch,
        targetProfile: profileOne,
      });
    }
    await this.updateViewAfterLike({
      _currentUserId,
      _targetUserId,
      hasReverseLike,
    });
  }

  public verifyNotSameUserById(userOne: string, userTwo: string) {
    if (userOne === userTwo) {
      throw new BadRequestException({
        message: HttpErrorMessages['You cannot like yourself'],
      });
    }
  }

  async verifyNotExistLike({
    _currentUserId,
    _targetUserId,
  }: {
    _currentUserId: Types.ObjectId;
    _targetUserId: Types.ObjectId;
  }) {
    const existLike = await this.likeModel.findOne({
      _userId: _currentUserId,
      _targetUserId,
    });
    if (existLike) {
      this.logger.log(
        `SEND_LIKE Exist like found ${JSON.stringify(existLike)}`,
      );
      throw new ConflictException(
        HttpErrorMessages['You already like this person'],
      );
    }
  }

  async findOneAndUpdateReverseLike({
    _targetUserId,
    _currentUserId,
  }: {
    _currentUserId: Types.ObjectId;
    _targetUserId: Types.ObjectId;
  }) {
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
    return await this.likeModel.model
      .findOneAndUpdate(reverseLikeFilter, reverseLikeUpdatePayload)
      .exec();
  }

  async createOne({
    _currentUserId,
    _targetUserId,
    reverseLike,
  }: {
    _currentUserId: Types.ObjectId;
    _targetUserId: Types.ObjectId;
    reverseLike: LikeDocument | null;
  }) {
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
  }

  async updateViewAfterLike({
    _currentUserId,
    _targetUserId,
    hasReverseLike,
  }: _CurrentTargetUserIds & { hasReverseLike: boolean }) {
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
    await this.viewModel
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
  }

  async createMatch({
    profileOne,
    profileTwo,
  }: {
    profileOne: ProfileDocument;
    profileTwo: ProfileDocument;
  }) {
    const createMatchPayload = { profileOne, profileTwo };
    this.logger.log(
      `CREATE_LIKE Create match payload: ${JSON.stringify(createMatchPayload)}`,
    );
    return await this.matchModel.createOne(createMatchPayload);
  }

  emitMatchToUser(userId: string, payload: MatchWithTargetUser) {
    this.logger.log(
      `SOCKET_EVENT Emit "${
        SOCKET_TO_CLIENT_EVENTS.MATCH
      }" userId: ${JSON.stringify(userId)} payload: ${JSON.stringify(payload)}`,
    );
    this.chatsGateway.server
      .to(userId)
      .emit(SOCKET_TO_CLIENT_EVENTS.MATCH, payload);
  }
}
