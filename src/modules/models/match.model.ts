import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';
import { Types } from 'mongoose';

import { HttpErrorMessages } from '../../commons/erros/http-error-messages.constant';
import { CommonModel } from './common-model';
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
  }

  async findOneOrFail(
    filter: FilterQuery<Match>,
    projection?: ProjectionType<Match> | null | undefined,
    options?: QueryOptions<Match> | null | undefined,
  ) {
    const findResult = await this.findOne(filter, projection, options);
    if (!findResult) {
      throw new NotFoundException(HttpErrorMessages['Match does not exist']);
    }
    return findResult;
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
