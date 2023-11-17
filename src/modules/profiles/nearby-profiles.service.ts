import { BadRequestException, Injectable } from '@nestjs/common';
import moment from 'moment';

import { APP_CONFIG } from '../../app.config';
import { ERROR_MESSAGES } from '../../commons/messages';
import { PaginatedResponse, Pagination } from '../../types';
import { ClientData } from '../auth/auth.type';
import { Profile, ProfileFilterModel, ProfileModel } from '../models';
import { FindManyNearbyProfilesQuery } from './dto';
import { ProfilesCommonService } from './profiles.common.service';

@Injectable()
export class NearbyProfilesService extends ProfilesCommonService {
  constructor(
    private readonly profileModel: ProfileModel,
    private readonly profileFilterModel: ProfileFilterModel,
  ) {
    super();

    this.limitRecordsPerQuery = APP_CONFIG.PAGINATION_LIMIT.NEARBY_USERS;
  }

  public async findMany(
    queryParams: FindManyNearbyProfilesQuery,
    client: ClientData,
  ): Promise<PaginatedResponse<Profile>> {
    const { _currentUserId } = this.getClient(client);
    const { _next } = queryParams;
    const geolocation =
      queryParams.longitude && queryParams.latitude
        ? this.getGeolocationFromQueryParams(queryParams)
        : (await this.profileModel.findOneOrFailById(_currentUserId))
            .geolocation;
    if (!geolocation) {
      throw new BadRequestException(
        ERROR_MESSAGES['Please enable location service in your device'],
      );
    }
    const minDistance = (_next ? this.getCursor(_next) : 0) + 0.00000000001;
    const profileFilter = await this.profileFilterModel.findOneOrFail({
      _id: _currentUserId,
    });
    const maxDistance = profileFilter.maxDistance * 1000;
    if (minDistance && minDistance >= maxDistance) {
      return {
        data: [],
        type: 'nearbyUsers',
        pagination: {
          _next: null,
        },
      };
    }
    const findResults = await this.profileModel.aggregate([
      {
        $geoNear: {
          key: 'geolocation',
          near: geolocation,
          distanceField: 'distance',
          // distanceMultiplier: 0.001,
          minDistance,
          maxDistance: maxDistance,
          query: {
            mediaFileCount: { $gt: 0 },
            gender: profileFilter.gender,
            birthday: {
              $gte: moment().subtract(profileFilter.maxAge, 'years').toDate(),
              $lte: moment().subtract(profileFilter.minAge, 'years').toDate(),
            },
            lastActivatedAt: {
              $gt: moment().subtract(10, 'h').toDate(),
            },
          },
        },
      },
      { $limit: this.limitRecordsPerQuery },
      {
        $project: this.profileModel.publicFields,
      },
    ]);

    return {
      type: 'nearbyUsers',
      data: findResults,
      pagination: this.getPagination(findResults),
    };
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
      _next: this.encodeFromString(`${lastData.distance}`),
    };
  }

  protected getCursor(_cursor: string): number {
    const cursor = this.decodeToString(_cursor);
    return +cursor;
  }

  // public getPagination(
  //   data: (Profile & { excludedUserIds?: string[] })[],
  // ): Pagination {
  //   const dataLength = data.length;
  //   if (!dataLength || dataLength < this.limitRecordsPerQuery) {
  //     return { _next: null };
  //   }
  //   const lastData = data[dataLength - 1];
  //   const minDistance = data[data.length - 1].distance;
  //   const excludedUserIds = data
  //     .filter((e) => e.distance === minDistance)
  //     .map((e) => e._id.toString());

  //   return {
  //     _next: this.encodeFromObj({
  //       minDistance: lastData.distance,
  //       excludedUserIds,
  //     }),
  //   };
  // }

  // protected getCursor(_cursor: string): NearbyUserCursor {
  //   const cursor = this.decodeToObj<NearbyUserCursor>(_cursor);

  //   return cursor;
  // }

  async test() {
    return await this.profileModel.model.find(
      {
        lastActivatedAt: {
          $gt: moment().subtract(20, 'hours'),
        },
      },
      // {},
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
