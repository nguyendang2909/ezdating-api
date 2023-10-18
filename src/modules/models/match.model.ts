import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';
import { Types } from 'mongoose';

import { HttpErrorMessages } from '../../commons/erros/http-error-messages.constant';
import { CommonModel } from './common-model';
import { Match, MatchDocument } from './schemas/match.schema';

@Injectable()
export class MatchModel extends CommonModel {
  constructor(
    @InjectModel(Match.name)
    public readonly model: Model<MatchDocument>,
  ) {
    super();
  }

  async findOneOrFail(
    filter?: FilterQuery<MatchDocument>,
    projection?: ProjectionType<MatchDocument> | null,
    options?: QueryOptions<MatchDocument> | null,
  ) {
    const findResult = await this.model
      .findOne(filter, projection, options)
      .exec();
    if (!findResult) {
      throw new NotFoundException(HttpErrorMessages['Match does not exist']);
    }
    console.log(222);
    return findResult;
  }

  public async findOneRelatedToUserId(
    _id: Types.ObjectId,
    _currentUserId: Types.ObjectId,
  ) {
    return this.model
      .findOne({
        _id,
        $or: [{ _userOneId: _currentUserId }, { _userTwoId: _currentUserId }],
      })
      .lean()
      .exec();
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
  }) {
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
}
