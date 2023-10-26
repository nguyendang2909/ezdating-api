import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Types } from 'mongoose';

import { CommonModel } from './common-model';
import {
  Match,
  MatchDocument,
  MatchWithTargetUser,
} from './schemas/match.schema';

@Injectable()
export class MatchModel extends CommonModel<Match> {
  constructor(
    @InjectModel(Match.name)
    readonly model: Model<MatchDocument>,
  ) {
    super();
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
  }): { _targetUserId: Types.ObjectId; targetUserId: string } {
    if (this.isUserOne({ currentUserId, userOneId })) {
      return {
        targetUserId: userTwoId,
        _targetUserId: new Types.ObjectId(userTwoId),
      };
    }

    return {
      targetUserId: userOneId,
      _targetUserId: new Types.ObjectId(userOneId),
    };
  }

  formatManyWithTargetProfile(
    matches: Match[],
    currentUserId: string,
  ): MatchWithTargetUser[] {
    return matches.map((e) => {
      return this.formatOneWithTargetProfile(e, currentUserId);
    });
  }

  formatOneWithTargetProfile(
    match: Match,
    currentUserId: string,
  ): MatchWithTargetUser {
    const { profileOne, profileTwo, userOneRead, userTwoRead, ...restE } =
      match;
    const isUserOne = this.isUserOne({
      currentUserId,
      userOneId: profileOne._id.toString(),
    });
    return {
      ...restE,
      read: isUserOne ? userOneRead : userTwoRead,
      targetProfile: isUserOne ? profileTwo : profileOne,
    };
  }
}
