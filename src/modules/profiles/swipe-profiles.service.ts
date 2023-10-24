import { BadRequestException, Injectable } from '@nestjs/common';
import { isArray } from 'lodash';

import { APP_CONFIG } from '../../app.config';
import { ApiService } from '../../commons/services/api.service';
import { ClientData } from '../auth/auth.type';
import { ProfileModel } from '../models';
import { FindManyDatingProfilesQuery } from './dto';
@Injectable()
export class SwipeProfilesService extends ApiService {
  constructor(private readonly profileModel: ProfileModel) {
    super();

    this.limitRecordsPerQuery = APP_CONFIG.PAGINATION_LIMIT.SWIPE_USERS;
  }

  public async findMany(
    queryParams: FindManyDatingProfilesQuery,
    clientData: ClientData,
  ) {
    const { minDistance, excludedUserId } = queryParams;
    const excludedUserIds =
      excludedUserId && isArray(excludedUserId) ? excludedUserId : [];
    const { id: currentUserId } = clientData;
    const _currentUserId = this.getObjectId(currentUserId);

    const profile = await this.profileModel.findOneOrFail({
      _id: _currentUserId,
    });

    const {
      geolocation,
      filterMaxAge,
      filterMinAge,
      filterMaxDistance,
      filterGender,
    } = profile;

    if (!geolocation?.coordinates[1]) {
      throw new BadRequestException();
    }

    const users = await this.profileModel.aggregate([
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
                minDistance: +minDistance,
              }
            : {}),
          maxDistance: filterMaxDistance,
          // distanceMultiplier: 0.001,
          query: {
            _id: {
              ...(excludedUserIds.length
                ? {
                    $nin: [
                      _currentUserId,
                      ...excludedUserIds.map((item) => this.getObjectId(item)),
                    ],
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
              $lt: filterMaxAge,
            },
            gender: filterGender,
          },
        },
      },
      {
        $sort: {
          lastActivatedAt: -1,
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
          age: 1,
          distance: 1,
          educationLevel: 1,
          gender: 1,
          height: 1,
          introduce: 1,
          jobTitle: 1,
          languages: 1,
          lastActivatedAt: 1,
          mediaFiles: 1,
          nickname: 1,
          relationshipGoal: 1,
          relationshipStatus: 1,
          role: 1,
          school: 1,
          status: 1,
          weight: 1,
        },
      },
    ]);

    return {
      type: 'swipeUsers',
      data: users,
      pagination: { _next: null },
    };
  }
}
