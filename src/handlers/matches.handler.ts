import { Injectable, Logger } from '@nestjs/common';
import mongoose, { Types } from 'mongoose';

import {
  Match,
  MatchModel,
  Profile,
  ProfileModel,
  TrashMatchModel,
  ViewModel,
} from '../models';
import { MatchesUtil } from '../utils';
import { MatchesSocketEventHandler } from './events';

@Injectable()
export class MatchesHandler {
  constructor(
    private readonly matchModel: MatchModel,
    private readonly profileModel: ProfileModel,
    private readonly viewModel: ViewModel,
    private readonly trashMatchModel: TrashMatchModel,
    private readonly matchesSocketEventHandler: MatchesSocketEventHandler,
    private readonly matchesUtil: MatchesUtil,
  ) {}

  logger = new Logger(MatchesHandler.name);

  async handleAfterUnmatch({
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
    this.matchesSocketEventHandler.emitUnMatchToUser(userOneId, {
      _id: match._id,
    });
    this.matchesSocketEventHandler.emitUnMatchToUser(userTwoId, {
      _id: match._id,
    });
    await this.trashMatchModel.createOne(match);
    const { _targetUserId } = this.matchesUtil.getTargetUserId({
      currentUserId,
      userOneId,
      userTwoId,
    });
    await this.viewModel
      .findOneAndUpdate(
        { 'profile._id': _currentUserId, 'targetProfile._id': _targetUserId },
        { $set: { isLiked: false, isMatched: false } },
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

  async handleAfterCreateMatch({
    match,
    _currentUserId,
  }: {
    _currentUserId: Types.ObjectId;
    match: Match;
  }) {
    this.matchesSocketEventHandler.emitMatchToUser(
      match.profileOne._id.toString(),
      this.matchesUtil.formatOneWithTargetProfile(match, true),
    );
    this.matchesSocketEventHandler.emitMatchToUser(
      match.profileTwo._id.toString(),
      this.matchesUtil.formatOneWithTargetProfile(match, false),
    );
    // Create or update like from currentUser
    // Update like from targetUser
    // Update view from 2 sides
  }

  async handleAfterFindOneMatch({
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
