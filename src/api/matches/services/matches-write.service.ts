import { Injectable } from '@nestjs/common';
import _ from 'lodash';

import { ApiWriteService } from '../../../commons';
import { MatchesHandler } from '../../../handlers/matches.handler';
import {
  MatchModel,
  MatchWithTargetProfile,
  ProfileModel,
} from '../../../models';
import { ClientData } from '../../auth/auth.type';
import { CreateMatchDto } from '../dto';

@Injectable()
export class MatchesWriteService extends ApiWriteService<
  MatchWithTargetProfile,
  CreateMatchDto
> {
  constructor(
    private readonly matchModel: MatchModel,
    private readonly profileModel: ProfileModel,
    private readonly matchesHandler: MatchesHandler,
  ) {
    super();
  }

  public async createOne(
    payload: CreateMatchDto,
    clientData: ClientData,
  ): Promise<MatchWithTargetProfile> {
    const { _currentUserId } = this.getClient(clientData);
    const { targetUserId } = payload;
    const _targetUserId = this.getObjectId(targetUserId);
    const { profileOne, profileTwo } =
      await this.profileModel.findTwoOrFailPublicByIds(
        _currentUserId,
        _targetUserId,
      );
    await this.matchModel.findOneAndFail({
      'profileOne._id': profileOne._id,
      'profileTwo._id': profileTwo._id,
    });
    const createdMatch = await this.matchModel.createOne({
      profileOne,
      profileTwo,
    });
    this.matchesHandler.handleAfterCreateMatch({
      match: createdMatch,
      _currentUserId,
    });
    const restCreatedMatch = _.omit(createdMatch, ['profileOne', 'profileTwo']);
    return {
      ...restCreatedMatch,
      targetProfile:
        profileOne._id.toString() === targetUserId ? profileOne : profileTwo,
    };
  }

  public async unmatch(id: string, clientData: ClientData) {
    const _id = this.getObjectId(id);
    const { id: currentUserId } = clientData;
    const _currentUserId = this.getObjectId(currentUserId);
    const existMatch = await this.matchModel.findOneOrFail({
      _id,
      $or: [
        { 'profileOne._id': _currentUserId },
        { 'profileTwo._id': _currentUserId },
      ],
    });
    await this.matchModel.deleteOneOrFail({
      _id,
      ...this.matchModel.queryUserOneOrUserTwo(_currentUserId),
    });
    this.matchesHandler.handleAfterUnmatch({
      match: existMatch,
      currentUserId,
    });
    return {
      _id: existMatch._id,
    };
  }
}
