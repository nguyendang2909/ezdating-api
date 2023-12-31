import { Injectable, Logger } from '@nestjs/common';
import mongoose, { Types } from 'mongoose';

import { SOCKET_TO_CLIENT_EVENTS } from '../../constants';
import { ChatsGateway } from '../chats/chats.gateway';
import { Profile, ProfileModel, TrashMatchModel, ViewModel } from '../models';
import { MatchModel } from '../models/match.model';
import { Match, MatchWithTargetProfile } from '../models/schemas/match.schema';

@Injectable()
export class MatchesHandler {
  constructor(
    private readonly matchModel: MatchModel,
    private readonly chatsGateway: ChatsGateway,
    private readonly profileModel: ProfileModel,
    private readonly viewModel: ViewModel,
    private readonly trashMatchModel: TrashMatchModel,
  ) {}

  logger = new Logger(MatchesHandler.name);

  async afterUnmatch({
    currentUserId,
    match,
  }: {
    currentUserId: string;
    match: Match;
  }) {
    const _currentUserId = new mongoose.Types.ObjectId(currentUserId);
    const { profileOne, profileTwo } = match;
    const userOneId = profileOne._id.toString();
    const userTwoId = profileTwo._id.toString();
    this.emitUnMatchToUser(userOneId, { _id: match._id });
    this.emitUnMatchToUser(userTwoId, { _id: match._id });
    await this.trashMatchModel.createOne(match);
    const { _targetUserId } = this.matchModel.getTargetUserId({
      currentUserId,
      userOneId,
      userTwoId,
    });
    await this.viewModel
      .findOneAndUpdate(
        {
          'profile._id': _currentUserId,
          'targetProfile._id': _targetUserId,
        },
        {
          $set: {
            isLiked: false,
            isMatched: false,
          },
        },
      )
      .catch((error) => {
        this.logger.error(
          `Failed to update like after unmatch  error: ${JSON.stringify(
            error,
          )}`,
        );
      });
    await this.viewModel
      .updateOne(
        { 'profile._id': _targetUserId, 'targetProfile._id': _currentUserId },
        { $set: { isMatched: false } },
      )
      .catch((error) => {
        this.logger.error(
          `Failed to update like from other to unmatch: ${JSON.stringify(
            error,
          )}`,
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
