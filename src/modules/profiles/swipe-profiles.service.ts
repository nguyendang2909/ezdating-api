import { Injectable } from '@nestjs/common';
import { isArray } from 'lodash';
import moment from 'moment';

import { APP_CONFIG } from '../../app.config';
import { ClientData } from '../auth/auth.type';
import { ProfileFilterModel, ProfileModel } from '../models';
import { FindManySwipeProfilesQuery } from './dto';
import { ProfilesCommonService } from './profiles.common.service';
@Injectable()
export class SwipeProfilesService extends ProfilesCommonService {
  constructor(
    private readonly profileModel: ProfileModel,
    private readonly profileFilterModel: ProfileFilterModel,
  ) {
    super();

    this.limitRecordsPerQuery = APP_CONFIG.PAGINATION_LIMIT.SWIPE_USERS;
  }

  public async findMany(
    queryParams: FindManySwipeProfilesQuery,
    clientData: ClientData,
  ) {
    const { excludedUserId } = queryParams;
    const excludedUserIds =
      excludedUserId && isArray(excludedUserId) ? excludedUserId : [];
    const { id: currentUserId } = clientData;
    const _currentUserId = this.getObjectId(currentUserId);
    const _stateId = queryParams.stateId
      ? this.getObjectId(queryParams.stateId)
      : (await this.profileModel.findOneOrFailById(_currentUserId)).state._id;
    const profileFilter = await this.profileFilterModel.findOneOrFail({
      _id: _currentUserId,
    });

    const users = await this.profileModel.aggregate([
      {
        $match: {
          mediaFileCount: { $gt: 0 },
          _id: { $ne: _currentUserId },
          'state._id': _stateId,
          gender: profileFilter.gender,
          birthday: {
            $gte: moment().subtract(profileFilter.maxAge, 'years').toDate(),
            $lte: moment().subtract(profileFilter.minAge, 'years').toDate(),
          },
          lastActivatedAt: {
            $gt: moment().subtract(1, 'h').toDate(),
          },
        },
      },
      { $limit: this.limitRecordsPerQuery },
    ]);

    return {
      type: 'swipeUsers',
      data: users,
      pagination: { _next: null },
    };
  }
}
