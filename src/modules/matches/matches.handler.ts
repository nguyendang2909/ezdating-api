import { Injectable, Logger } from '@nestjs/common';
import { Types } from 'mongoose';

import { APP_CONFIG } from '../../app.config';
import { ApiCursorDateService } from '../../commons/services/api-cursor-date.service';
import { SOCKET_TO_CLIENT_EVENTS } from '../../constants';
import { ChatsGateway } from '../chats/chats.gateway';
import { Profile, ProfileModel } from '../models';
import { LikeModel } from '../models/like.model';
import { MatchModel } from '../models/match.model';
import {
  Match,
  MatchDocument,
  MatchWithTargetProfile,
} from '../models/schemas/match.schema';

@Injectable()
export class MatchesHandler extends ApiCursorDateService {
  constructor(
    private readonly matchModel: MatchModel,
    private readonly chatsGateway: ChatsGateway,
    private readonly likeModel: LikeModel,
    private readonly profileModel: ProfileModel,
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

  handleAfterCreateMatch({
    userOneId,
    userTwoId,
    match,
  }: {
    match: MatchDocument;
    userOneId: string;
    userTwoId: string;
  }) {
    this.emitMatchToUser(
      userOneId,
      this.matchModel.formatOneWithTargetProfile(match, true),
    );
    this.emitMatchToUser(
      userTwoId,
      this.matchModel.formatOneWithTargetProfile(match, false),
    );
  }

  afterFindOneMatch({
    match,
    profileOne,
    profileTwo,
  }: {
    match: Match;
    profileOne: Profile;
    profileTwo: Profile;
  }) {
    this.profileModel.updateOneById(match._id, { profileOne, profileTwo });
  }
}
