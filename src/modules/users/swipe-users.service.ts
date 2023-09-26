import { BadRequestException, Injectable } from '@nestjs/common';
import { isArray } from 'lodash';
import moment from 'moment';

import { APP_CONFIG } from '../../app.config';
import { UserStatuses } from '../../commons/constants';
import { HttpErrorMessages } from '../../commons/erros/http-error-messages.constant';
import { ApiService } from '../../commons/services/api.service';
import { ClientData } from '../auth/auth.type';
import { UserModel } from '../models/user.model';
import { FindManyDatingUsersQuery } from './dto/find-many-dating-users.dto';
@Injectable()
export class SwipeUsersService extends ApiService {
  constructor(private readonly userModel: UserModel) {
    super();

    this.limitRecordsPerQuery = APP_CONFIG.PAGINATION_LIMIT.SWIPE_USERS;
  }

  public async findMany(
    queryParams: FindManyDatingUsersQuery,
    clientData: ClientData,
  ) {
    const { minDistance, excludedUserId } = queryParams;
    const excludedUserIds =
      excludedUserId && isArray(excludedUserId) ? excludedUserId : [];
    const { id: currentUserId } = clientData;
    const _currentUserId = this.getObjectId(currentUserId);

    const user = await this.userModel.findOneOrFail({
      _id: _currentUserId,
    });

    const {
      geolocation,
      filterMaxAge,
      filterMinAge,
      filterMaxDistance,
      filterGender,
      gender,
    } = user;

    if (!user.geolocation) {
      throw new BadRequestException();
    }

    if (
      !geolocation?.coordinates[1] ||
      !filterMaxAge ||
      !filterMinAge ||
      !gender ||
      !filterGender ||
      !filterMaxDistance
    ) {
      throw new BadRequestException({
        message:
          HttpErrorMessages[
            'You do not have a basic info. Please complete it.'
          ],
      });
    }

    const filterMaxBirthday = moment().subtract(filterMinAge, 'years').toDate();
    const filterMinBirthday = moment().subtract(filterMaxAge, 'years').toDate();

    const users = await this.userModel.model.aggregate([
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
          lastActivatedAt: -1,
        },
      },
      { $limit: this.limitRecordsPerQuery },
      {
        $lookup: {
          from: 'mediafiles',
          let: {
            userId: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_userId', '$$userId'],
                },
              },
            },
            {
              $limit: 6,
            },
            {
              $project: {
                _id: true,
                location: true,
              },
            },
          ],
          as: 'mediaFiles',
        },
      },
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
    };
  }
}
