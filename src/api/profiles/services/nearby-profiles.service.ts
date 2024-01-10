import { BadRequestException, Injectable } from '@nestjs/common';
import moment from 'moment';

import { APP_CONFIG } from '../../../app.config';
import { ERROR_MESSAGES } from '../../../commons/messages';
import { ApiReadService } from '../../../commons/services/api/api-read.base.service';
import { Profile, ProfileFilterModel, ProfileModel } from '../../../models';
import { Pagination } from '../../../types';
import { ProfilesUtil } from '../../../utils';
import { PaginationCursorNumberUtil } from '../../../utils/paginations/pagination-cursor-number.util';
import { ClientData } from '../../auth/auth.type';
import { FindManyNearbyProfilesQuery } from '../dto';

@Injectable()
export class NearbyProfilesService extends ApiReadService<
  Profile,
  FindManyNearbyProfilesQuery
> {
  constructor(
    protected readonly profileModel: ProfileModel,
    protected readonly profileFilterModel: ProfileFilterModel,
    protected readonly profilesUtil: ProfilesUtil,
    protected readonly paginationUtil: PaginationCursorNumberUtil,
  ) {
    super();
    this.limitRecordsPerQuery = APP_CONFIG.PAGINATION_LIMIT.NEARBY_USERS;
  }

  public async findMany(
    queryParams: FindManyNearbyProfilesQuery,
    client: ClientData,
  ): Promise<Profile[]> {
    const { _currentUserId } = this.getClient(client);
    const { _next } = queryParams;
    const geolocation =
      queryParams.longitude && queryParams.latitude
        ? this.profilesUtil.getGeolocationFromQueryParams(queryParams)
        : (await this.profileModel.findOneOrFailById(_currentUserId))
            .geolocation;
    if (!geolocation) {
      throw new BadRequestException(
        ERROR_MESSAGES['Please enable location service in your device'],
      );
    }
    const minDistance =
      (_next ? this.paginationUtil.getCursor(_next) : 0) + 0.00000000001;
    const profileFilter = await this.profileFilterModel.findOneOrFail({
      _id: _currentUserId,
    });
    // const maxDistance = profileFilter.maxDistance * 1000;
    // if (minDistance && minDistance >= maxDistance) {
    //   return [];
    // }
    const findResults = await this.profileModel.aggregate([
      {
        $geoNear: {
          key: 'geolocation',
          near: geolocation,
          distanceField: 'distance',
          // distanceMultiplier: 0.001,
          minDistance,
          // maxDistance: maxDistance,
          query: {
            lastActivatedAt: {
              // $gt: moment().subtract(10, 'h').toDate(),
              $exists: true,
            },
            birthday: {
              $gte: moment().subtract(profileFilter.maxAge, 'years').toDate(),
              $lte: moment().subtract(profileFilter.minAge, 'years').toDate(),
            },
            gender: profileFilter.gender,
          },
        },
      },
      { $limit: this.limitRecordsPerQuery },
      { $project: this.profileModel.publicFields },
    ]);

    return findResults;
  }

  public getPagination(
    data: (Profile & { excludedUserIds?: string[] })[],
  ): Pagination {
    const dataLength = data.length;
    if (!dataLength || dataLength < this.limitRecordsPerQuery) {
      return { _next: null };
    }
    const lastData = data[dataLength - 1];
    return {
      _next: this.paginationUtil.encodeFromString(`${lastData.distance}`),
    };
  }

  async test() {
    return await this.profileModel.model.find(
      {
        lastActivatedAt: {
          $gt: moment().subtract(20, 'hours'),
        },
      },
      {},
      {
        sort: {
          lastActivatedAt: 1,
        },
        limit: 10,
      },
    );
  }
}
