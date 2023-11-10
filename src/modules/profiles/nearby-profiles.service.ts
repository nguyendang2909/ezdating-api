import { BadRequestException, Injectable } from '@nestjs/common';
import moment from 'moment';

import { APP_CONFIG } from '../../app.config';
import { ERROR_MESSAGES } from '../../commons/messages';
import { ApiService } from '../../commons/services/api.service';
import { PaginatedResponse, Pagination } from '../../types';
import { ClientData } from '../auth/auth.type';
import { Profile, ProfileModel } from '../models';
import { FindManyNearbyProfilesQuery } from './dto';
@Injectable()
export class NearbyProfilesService extends ApiService {
  constructor(private readonly profileModel: ProfileModel) {
    super();

    this.limitRecordsPerQuery = APP_CONFIG.PAGINATION_LIMIT.NEARBY_USERS;
  }

  public async findMany(
    queryParams: FindManyNearbyProfilesQuery,
    client: ClientData,
  ): Promise<PaginatedResponse<Profile>> {
    const { _currentUserId } = this.getClient(client);
    const { _next } = queryParams;
    const cursor = _next ? this.getCursor(_next) : undefined;
    const {
      geolocation,
      filterMaxAge,
      filterMinAge,
      filterMaxDistance: filterMaxDistanceAsKm,
      filterGender,
      gender,
    } = await this.profileModel.findOneOrFail({
      _id: _currentUserId,
    });
    if (!geolocation?.coordinates) {
      throw new BadRequestException(
        ERROR_MESSAGES['Please enable location service in your device'],
      );
    }
    // TODO: uncomment this feature
    // const filterMaxDistance = filterMaxDistanceAsKm * 1000;
    // if (minDistance && minDistance >= filterMaxDistance) {
    //   return {
    //     data: [],
    //     type: 'nearbyUsers',
    //     pagination: {
    //       _next: null,
    //     },
    //   };
    // }
    const findResults = await this.profileModel.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [
              geolocation.coordinates[0],
              geolocation.coordinates[1],
            ],
          },
          distanceField: 'distance',
          // distanceMultiplier: 0.001,
          ...(cursor
            ? {
                minDistance: cursor,
              }
            : { minDistance: 0.00000000001 }),
          // TODO: uncoment this line (important for launch)
          // maxDistance: filterMaxDistance,
          query: {
            _id: { $ne: _currentUserId },
            lastActivatedAt: {
              $gt: moment().subtract(1, 'hour').toDate(),
            },
            mediaFileCount: { $gt: 0 },
            gender: filterGender,
            birthday: {
              $gte: moment().subtract(filterMaxAge, 'years').toDate(),
              $lte: moment().subtract(filterMinAge, 'years').toDate(),
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
    return await this.profileModel.findMany(
      {
        birthday: {
          $gt: moment().subtract(1, 'days'),
        },
      },
      // {},
      // {
      //   limit: 1,
      // },
    );
  }
}
