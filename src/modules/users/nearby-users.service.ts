import { BadRequestException, Injectable } from '@nestjs/common';
import moment from 'moment';
import { Types } from 'mongoose';

import { APP_CONFIG } from '../../app.config';
import { UserStatuses } from '../../commons/constants';
import { HttpErrorMessages } from '../../commons/erros/http-error-messages.constant';
import { ApiService } from '../../commons/services/api.service';
import {
  NearbyUserCursor,
  PaginatedResponse,
  Pagination,
} from '../../commons/types';
import { ClientData } from '../auth/auth.type';
import { User } from '../models/schemas/user.schema';
import { UserModel } from '../models/user.model';
import { FindManyNearbyUsersQuery } from './dto/find-nearby-users.dto';
@Injectable()
export class NearbyUsersService extends ApiService {
  constructor(private readonly userModel: UserModel) {
    super();

    this.limitRecordsPerQuery = APP_CONFIG.PAGINATION_LIMIT.NEARBY_USERS;
  }

  public async findMany(
    queryParams: FindManyNearbyUsersQuery,
    clientData: ClientData,
  ): Promise<PaginatedResponse<User>> {
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
      gender,
    } = await this.userModel.findOneOrFail({
      _id: _currentUserId,
    });
    if (
      !filterMaxAge ||
      !filterMinAge ||
      !gender ||
      !filterGender ||
      !filterMaxDistanceAsKm
    ) {
      throw new BadRequestException(
        HttpErrorMessages['You do not have a basic info. Please complete it.'],
      );
    }
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

    const filterMaxBirthday = moment().subtract(filterMinAge, 'years').toDate();
    const filterMinBirthday = moment().subtract(filterMaxAge, 'years').toDate();

    const findResults = await this.userModel.aggregate([
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
            status: {
              $in: [UserStatuses.activated, UserStatuses.verified],
            },
            // lastActivatedAt: {
            //   $gt: moment().subtract(7, 'd').toDate(),
            // },
            birthday: {
              $gt: filterMinBirthday,
              $lt: filterMaxBirthday,
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
      {
        $project: {
          distance: 1,
          ...this.userModel.matchUserFields,
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
    data: (User & { _id: Types.ObjectId; excludedUserIds?: string[] })[],
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
