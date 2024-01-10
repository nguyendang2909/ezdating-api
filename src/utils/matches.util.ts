import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';

import { Match, MatchWithTargetProfile } from '../models';
import { BaseUtil } from './bases/base.util';

@Injectable()
export class MatchesUtil extends BaseUtil {
  public getSortedUserIds({
    currentUserId,
    targetUserId,
  }: {
    currentUserId: string;
    targetUserId: string;
  }): {
    _userOneId: mongoose.Types.ObjectId;
    _userTwoId: mongoose.Types.ObjectId;
    isUserOne: boolean;
    sortedUserIds: string[];
    userOneId: string;
    userTwoId: string;
  } {
    const sortedUserIds = [currentUserId, targetUserId].sort();
    const userOneId = sortedUserIds[0];
    const userTwoId = sortedUserIds[1];

    return {
      sortedUserIds,
      isUserOne: sortedUserIds[0] === currentUserId,
      userOneId,
      userTwoId,
      _userOneId: new mongoose.Types.ObjectId(userOneId),
      _userTwoId: new mongoose.Types.ObjectId(userTwoId),
    };
  }

  isUserOne({
    currentUserId,
    userOneId,
  }: {
    currentUserId: string;
    userOneId: string;
  }): boolean {
    return currentUserId === userOneId;
  }

  getTargetUserId({
    currentUserId,
    userOneId,
    userTwoId,
  }: {
    currentUserId: string;
    userOneId: string;
    userTwoId: string;
  }): {
    _targetUserId: mongoose.Types.ObjectId;
    isUserOne: boolean;
    targetUserId: string;
  } {
    if (this.isUserOne({ currentUserId, userOneId })) {
      return {
        targetUserId: userTwoId,
        _targetUserId: new mongoose.Types.ObjectId(userTwoId),
        isUserOne: true,
      };
    }
    return {
      targetUserId: userOneId,
      _targetUserId: new mongoose.Types.ObjectId(userOneId),
      isUserOne: false,
    };
  }

  formatManyWithTargetProfile(
    matches: Match[],
    currentUserId: string,
  ): MatchWithTargetProfile[] {
    return matches.map((e) => {
      return this.formatOneWithTargetProfile(
        e,
        this.isUserOne({
          currentUserId,
          userOneId: e.profileOne._id.toString(),
        }),
      );
    });
  }

  formatOneWithTargetProfile(
    match: Match,
    isUserOne: boolean,
  ): MatchWithTargetProfile {
    const { profileOne, profileTwo, userOneRead, userTwoRead, ...restE } =
      match;
    return {
      ...restE,
      read: isUserOne ? userOneRead : userTwoRead,
      targetProfile: isUserOne ? profileTwo : profileOne,
    };
  }
}
