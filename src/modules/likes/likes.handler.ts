import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';

import { APP_CONFIG } from '../../app.config';
import { DbService } from '../../commons';
import { ERROR_MESSAGES } from '../../commons/messages/error-messages.constant';
import { SOCKET_TO_CLIENT_EVENTS } from '../../constants';
import { ChatsGateway } from '../chats/chats.gateway';
import { MatchWithTargetProfile, Profile, ProfileModel, View } from '../models';
import { LikeModel } from '../models/like.model';
import { MatchModel } from '../models/match.model';
import { Like } from '../models/schemas/like.schema';
import { ViewModel } from '../models/view.model';

@Injectable()
export class LikesHandler extends DbService {
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

  private readonly logger = new Logger(LikesHandler.name);

  async afterSendLike({
    like,
    hasReverseLike,
    profileOne,
    profileTwo,
  }: {
    hasReverseLike: boolean;
    like: Like;
    profileOne: Profile;
    profileTwo: Profile;
  }) {
    if (hasReverseLike) {
      const createdMatch = await this.matchModel.createOne({
        profileOne,
        profileTwo,
      });
      this.emitMatchToUser(
        profileOne._id.toString(),
        this.matchModel.formatOneWithTargetProfile(createdMatch, true),
      );
      this.emitMatchToUser(
        profileTwo._id.toString(),
        this.matchModel.formatOneWithTargetProfile(createdMatch, false),
      );
    }
    await this.updateViewAfterLike({
      like,
      hasReverseLike,
    });
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
        ERROR_MESSAGES['You already like this person'],
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

  emitMatchToUser(userId: string, payload: MatchWithTargetProfile) {
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
