import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Types } from 'mongoose';

import { CommonModel } from './common-model';
import { Match } from './schemas/match.schema';

@Injectable()
export class MatchModel extends CommonModel {
  constructor(
    @InjectModel(Match.name)
    public readonly model: Model<Match>,
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
    sortedUserIds: string[];
    isUserOne: boolean;
    userOneId: string;
    userTwoId: string;
    _userOneId: Types.ObjectId;
    _userTwoId: Types.ObjectId;
  } {
    const sortedUserIds = [currentUserId, targetUserId].sort();
    const userOneId = sortedUserIds[0];
    const userTwoId = sortedUserIds[1];

    return {
      sortedUserIds,
      isUserOne: sortedUserIds[0] === currentUserId,
      userOneId,
      userTwoId,
      _userOneId: this.getObjectId(userOneId),
      _userTwoId: this.getObjectId(userTwoId),
    };
  }
}
