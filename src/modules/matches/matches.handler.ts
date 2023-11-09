import { Injectable, Logger } from '@nestjs/common';
import { Types } from 'mongoose';

import { APP_CONFIG } from '../../app.config';
import { ApiCursorDateService } from '../../commons/services/api-cursor-date.service';
import { SOCKET_TO_CLIENT_EVENTS } from '../../constants';
import { ChatsGateway } from '../chats/chats.gateway';
import { MessageModel, Profile, ProfileModel, ViewModel } from '../models';
import { LikeModel } from '../models/like.model';
import { MatchModel } from '../models/match.model';
import { Match, MatchWithTargetProfile } from '../models/schemas/match.schema';
import { MatchesPublisher } from './matches.publisher';

@Injectable()
export class MatchesHandler extends ApiCursorDateService {
  constructor(
    private readonly matchModel: MatchModel,
    private readonly chatsGateway: ChatsGateway,
    private readonly likeModel: LikeModel,
    private readonly profileModel: ProfileModel,
    private readonly messageModel: MessageModel,
    private readonly matchesPublisher: MatchesPublisher,
    private readonly viewModel: ViewModel,
  ) {
    super();
    this.limitRecordsPerQuery = APP_CONFIG.PAGINATION_LIMIT.MATCHES;
  }

  private readonly logger = new Logger(MatchesHandler.name);

  async afterUnmatch({
    currentUserId,
    match,
  }: {
    currentUserId: string;
    match: Match;
  }) {
    const _currentUserId = this.getObjectId(currentUserId);
    const { profileOne, profileTwo } = match;
    const userOneId = profileOne._id.toString();
    const userTwoId = profileTwo._id.toString();
    const { _targetUserId } = this.matchModel.getTargetUserId({
      currentUserId,
      userOneId,
      userTwoId,
    });
    this.likeModel
      .deleteOne({
        'profile._id': _currentUserId,
        'targetProfile._id': _targetUserId,
      })
      .catch((error) => {
        this.logger.log(
          `UNMATCH Delete like failed filter error: ${JSON.stringify(error)}`,
        );
      });
    this.likeModel
      .updateOne(
        { 'profile._id': _targetUserId, 'targetProfile._id': _currentUserId },
        { $set: { isMatched: false } },
      )
      .catch((error) => {
        this.logger.log(
          `UNMATCH Update like from targetUser failed: ${JSON.stringify(
            error,
          )}`,
        );
      });
    this.emitUnMatchToUser(userOneId, { _id: match._id });
    this.emitUnMatchToUser(userTwoId, { _id: match._id });
    // TODO: queue
    // this.matchesPublisher.publishUnmatched(match._id.toString());
    this.viewModel.updateOne(
      {
        'profile.id': _currentUserId,
        'targetProfile._id': _targetUserId,
      },
      {
        $set: {
          isLiked: false,
          isMatched: false,
        },
      },
    );
    this.viewModel.updateOne(
      {
        'profile.id': _targetUserId,
        'targetProfile._id': _currentUserId,
      },
      {
        $set: {
          isMatched: false,
        },
      },
    );
    this.messageModel.deleteMany({ _matchId: match._id });
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

  emitUnMatchToUser(userId: string, payload: { _id: Types.ObjectId }) {
    this.logger.log(
      `SOCKET_EVENT Emit "${
        SOCKET_TO_CLIENT_EVENTS.UNMATCH
      }" userId: ${JSON.stringify(userId)} payload: ${JSON.stringify(payload)}`,
    );
    this.chatsGateway.server
      .to(userId)
      .emit(SOCKET_TO_CLIENT_EVENTS.UNMATCH, payload);
  }

  async handleAfterCreateMatch({
    match,
    _currentUserId,
  }: {
    _currentUserId: Types.ObjectId;
    match: Match;
  }) {
    this.emitMatchToUser(
      match.profileOne._id.toString(),
      this.matchModel.formatOneWithTargetProfile(match, true),
    );
    this.emitMatchToUser(
      match.profileTwo._id.toString(),
      this.matchModel.formatOneWithTargetProfile(match, false),
    );
    // Create or update like from currentUser
    // Update like from targetUser
    // Update view from 2 sides
  }

  async afterFindOneMatch({
    match,
    profileOne,
    profileTwo,
  }: {
    match: Match;
    profileOne: Profile;
    profileTwo: Profile;
  }) {
    await this.profileModel.updateOneById(match._id, {
      profileOne,
      profileTwo,
    });
  }
}
