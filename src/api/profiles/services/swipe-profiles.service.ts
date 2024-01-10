import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { Types } from 'mongoose';

import { APP_CONFIG } from '../../../app.config';
import { ApiReadService } from '../../../commons/services/api/api-read.base.service';
import {
  Profile,
  ProfileFilterModel,
  ProfileModel,
  ViewModel,
} from '../../../models';
import { ClientData } from '../../auth/auth.type';
import { FindManySwipeProfilesQuery } from '../dto';

@Injectable()
export class SwipeProfilesService extends ApiReadService<
  Profile,
  FindManySwipeProfilesQuery
> {
  constructor(
    private readonly profileModel: ProfileModel,
    private readonly profileFilterModel: ProfileFilterModel,
    private readonly viewModel: ViewModel,
  ) {
    super();
    this.limitRecordsPerQuery = APP_CONFIG.PAGINATION_LIMIT.SWIPE_USERS;
  }

  public async findMany(
    queryParams: FindManySwipeProfilesQuery,
    clientData: ClientData,
  ) {
    const { _currentUserId } = this.getClient(clientData);
    const currentProfile = await this.profileModel.findOneOrFailById(
      _currentUserId,
    );
    const excludedUserIds = await this.getExcludedUserIds(
      currentProfile,
      queryParams.excludedUserId,
    );
    const _stateId = queryParams.stateId
      ? this.getObjectId(queryParams.stateId)
      : currentProfile.state?._id;
    const profileFilter = await this.profileFilterModel.findOneOrFail({
      _id: _currentUserId,
    });
    const users = await this.profileModel.findMany(
      {
        lastActivatedAt: {
          $exists: true,
          // $gt: moment().subtract(10, 'h').toDate(),
        },
        birthday: {
          $gte: moment().subtract(profileFilter.maxAge, 'years').toDate(),
          $lte: moment().subtract(profileFilter.minAge, 'years').toDate(),
        },
        _id: { $nin: excludedUserIds },
        gender: profileFilter.gender,
        'state._id': _stateId,
      },
      this.profileModel.publicFields,
      { limit: this.limitRecordsPerQuery },
    );

    return users;
  }

  async getExcludedUserIds(
    profile: Profile,
    excludedUserId?: string | string[],
  ): Promise<Types.ObjectId[]> {
    const excludedUserIds = [profile._id];
    if (excludedUserId) {
      const excludedIds = Array.isArray(excludedUserId)
        ? excludedUserId.map((e) => this.getObjectId(e))
        : [this.getObjectId(excludedUserId)];
      excludedUserIds.push(...excludedIds);
    }
    const views = await this.viewModel.findMany(
      {
        'profile._id': profile._id,
        'targetProfile.state._id': profile.state?._id,
      },
      { 'targetProfile._id': 1 },
      { limit: 1000, sort: { _id: -1 } },
    );
    excludedUserIds.push(...views.map((e) => e.targetProfile._id));
    return excludedUserIds;
  }
}
