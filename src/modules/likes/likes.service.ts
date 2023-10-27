import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';

import { APP_CONFIG } from '../../app.config';
import { HttpErrorMessages } from '../../commons/erros/http-error-messages.constant';
import { ApiCursorDateService } from '../../commons/services/api-cursor-date.service';
import { SOCKET_TO_CLIENT_EVENTS } from '../../constants';
import { PaginatedResponse, Pagination } from '../../types';
import { ClientData } from '../auth/auth.type';
import { ChatsGateway } from '../chats/chats.gateway';
import { MatchWithTargetUser, ProfileModel, View } from '../models';
import { LikeModel } from '../models/like.model';
import { MatchModel } from '../models/match.model';
import { Like, LikeDocument } from '../models/schemas/like.schema';
import { ViewModel } from '../models/view.model';
import { FindManyLikedMeDto } from './dto/find-user-like-me.dto';
import { SendLikeDto } from './dto/send-like.dto';
import { LikesHandler } from './likes.handler';

@Injectable()
export class LikesService extends ApiCursorDateService {
  constructor(
    private readonly likeModel: LikeModel,
    private readonly chatsGateway: ChatsGateway,
    private readonly matchModel: MatchModel,
    private readonly viewModel: ViewModel,
    private readonly profileModel: ProfileModel,
    private readonly likesHandler: LikesHandler,
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
    const isUserOne = this.matchModel.isUserOne({
      currentUserId,
      userOneId: profileOne._id.toString(),
    });
    const currentProfile = isUserOne ? profileOne : profileTwo;
    const targetProfile = isUserOne ? profileTwo : profileOne;
    const like = await this.likeModel.createOne({
      profile: currentProfile,
      targetProfile,
      ...(reverseLike ? { isMatched: true } : {}),
    });
    this.likesHandler.afterSendLike({
      like,
      hasReverseLike: !!reverseLike,
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
    const findResults = await this.likeModel.findMany(
      {
        'targetProfile._id': _currentUserId,
        isMatched: false,
        ...(cursor
          ? {
              createdAt: {
                $lt: cursor,
              },
            }
          : {}),
      },
      {},
      {
        sort: {
          createdAt: -1,
        },
        limit: this.limitRecordsPerQuery,
      },
    );

    return {
      type: 'likedMe',
      data: findResults,
      pagination: this.getPagination(findResults),
    };
  }

  public getPagination(data: LikeDocument[]): Pagination {
    return this.getPaginationByField(data, 'createdAt');
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

  async updateViewAfterLike({
    like,
    hasReverseLike,
  }: {
    hasReverseLike: boolean;
    like: Like;
  }) {
    const updateViewFilter: FilterQuery<View> = {
      _userId: like.profile._id,
      _targetUserId: like.targetProfile._id,
    };
    const updateViewPayload = {
      isLiked: true,
      ...(hasReverseLike ? { isMatched: true } : {}),
    };
    const updateViewOptions = { upsert: true };
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
