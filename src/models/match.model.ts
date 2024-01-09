import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Types } from 'mongoose';

import { ERROR_MESSAGES } from '../commons/messages/error-messages.constant';
import { CommonModel } from './bases/common-model';
import {
  Match,
  MatchDocument,
  MatchWithTargetProfile,
} from './schemas/match.schema';

@Injectable()
export class MatchModel extends CommonModel<Match> {
  constructor(
    @InjectModel(Match.name)
    readonly model: Model<MatchDocument>,
  ) {
    super();
    this.conflictMessage = ERROR_MESSAGES['Match already exists'];
    this.notFoundMessage = ERROR_MESSAGES['Match does not exist'];
  }

  public getSortedUserIds({
    currentUserId,
    targetUserId,
  }: {
    currentUserId: string;
    targetUserId: string;
  }): {
    _userOneId: Types.ObjectId;
    _userTwoId: Types.ObjectId;
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
      _userOneId: new Types.ObjectId(userOneId),
      _userTwoId: new Types.ObjectId(userTwoId),
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
    _targetUserId: Types.ObjectId;
    isUserOne: boolean;
    targetUserId: string;
  } {
    if (this.isUserOne({ currentUserId, userOneId })) {
      return {
        targetUserId: userTwoId,
        _targetUserId: new Types.ObjectId(userTwoId),
        isUserOne: true,
      };
    }
    return {
      targetUserId: userOneId,
      _targetUserId: new Types.ObjectId(userOneId),
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

  queryUserOneOrUserTwo(_currentUserId: Types.ObjectId) {
    return {
      $or: [
        { 'profileOne._id': _currentUserId },
        { 'profileTwo._id': _currentUserId },
      ],
    };
  }
}
