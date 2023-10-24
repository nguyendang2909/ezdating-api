import { BadRequestException, Injectable } from '@nestjs/common';

import { APP_CONFIG } from '../../app.config';
import { HttpErrorMessages } from '../../commons/erros/http-error-messages.constant';
import { ApiService } from '../../commons/services/api.service';
import { NearbyUserCursor, PaginatedResponse, Pagination } from '../../types';
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
    clientData: ClientData,
  ): Promise<PaginatedResponse<Profile>> {
    const { _next } = queryParams;
    const cursor = _next ? this.getCursor(_next) : undefined;
    const minDistance = cursor ? cursor.minDistance : undefined;
    const excludedUserIds = cursor
      ? cursor.excludedUserIds?.map((e) => this.getObjectId(e))
      : undefined;
    const { id: currentUserId } = clientData;
    const _currentUserId = this.getObjectId(currentUserId);
    const {
      geolocation,
      filterMaxAge,
      filterMinAge,
      filterMaxDistance: filterMaxDistanceAsKm,
      filterGender,
    } = await this.profileModel.findOneOrFail({
      _id: _currentUserId,
    });
    if (!geolocation?.coordinates) {
      throw new BadRequestException(
        HttpErrorMessages['Please enable location service in your device'],
      );
    }
    const filterMaxDistance = filterMaxDistanceAsKm * 1000;
    if (minDistance && minDistance >= filterMaxDistance) {
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
          near: {
            type: 'Point',
            coordinates: [
              geolocation.coordinates[0],
              geolocation.coordinates[1],
            ],
          },
          distanceField: 'distance',
          ...(minDistance
            ? {
                minDistance: minDistance,
              }
            : {}),
          maxDistance: filterMaxDistance,
          // distanceMultiplier: 0.001,
          query: {
            _id: {
              ...(excludedUserIds?.length
                ? {
                    $nin: [_currentUserId, ...excludedUserIds],
                  }
                : {
                    $ne: _currentUserId,
                  }),
            },
            // lastActivatedAt: {
            //   $gt: moment().subtract(7, 'd').toDate(),
            // },
            age: {
              $gte: filterMinAge,
              $lte: filterMaxAge,
            },
            gender: filterGender,
          },
        },
      },
      {
        $sort: {
          distance: 1,
          _id: 1,
        },
      },
      { $limit: this.limitRecordsPerQuery },
      {
        $set: {
          age: {
            $dateDiff: {
              startDate: '$birthday',
              endDate: '$$NOW',
              unit: 'year',
            },
          },
        },
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
    const minDistance = data[data.length - 1].distance;
    const excludedUserIds = data
      .filter((e) => e.distance === minDistance)
      .map((e) => e._id.toString());

    return {
      _next: this.encodeFromObj({
        distance: lastData.distance,
        excludedUserIds,
      }),
    };
  }

  protected getCursor(_cursor: string): NearbyUserCursor {
    const cursor = this.decodeToObj<NearbyUserCursor>(_cursor);

    return cursor;
  }
}
