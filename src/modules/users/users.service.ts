import { BadRequestException, Injectable } from '@nestjs/common';
import { isArray } from 'lodash';
import moment from 'moment';

import { UserStatuses } from '../../commons/constants/constants';
import { HttpErrorCodes } from '../../commons/erros/http-error-codes.constant';
import { ClientData } from '../auth/auth.type';
import { MediaFileModel } from '../models/media-file.model';
import { UserModel } from '../models/user.model';
import { FindManyDatingUsersDto } from './dto/find-many-dating-users.dto';
import { FindManyNearbyUsersQuery } from './dto/find-nearby-users.dto';
@Injectable()
export class UsersService {
  constructor(
    private readonly userModel: UserModel,
    private readonly mediaFileModel: MediaFileModel, // private readonly stateModel: StateModel, // private readonly countryModel: CountryModel,
  ) {}

  public async findManySwipe(
    queryParams: FindManyDatingUsersDto,
    clientData: ClientData,
  ) {
    const { minDistance, filterUserId } = queryParams;
    const { id: currentUserId } = clientData;
    const _currentUserId = this.userModel.getObjectId(currentUserId);

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
        errorCode: HttpErrorCodes.YOU_DO_NOT_HAVE_BASIC_INFO,
        message: 'You do not have a basic info. Please complete it!',
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
              ...(filterUserId
                ? {
                    $nin: [
                      _currentUserId,
                      filterUserId.map((item) =>
                        this.userModel.getObjectId(item),
                      ),
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
      { $limit: 20 },
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
          lastActivatedAt: 1,
          languages: 1,
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

  public async findManyNearby(
    queryParams: FindManyNearbyUsersQuery,
    clientData: ClientData,
  ) {
    const { excludedUserId, _next, _prev } = queryParams;
    const excludedUserIds =
      excludedUserId && isArray(excludedUserId) ? excludedUserId : [];
    const cursorAsString = _next || _prev;
    const cursor = cursorAsString ? +cursorAsString : undefined;
    const { id: currentUserId } = clientData;
    const _currentUserId = this.userModel.getObjectId(currentUserId);
    const {
      geolocation,
      filterMaxAge,
      filterMinAge,
      filterMaxDistance,
      filterGender,
      gender,
    } = await this.userModel.findOneOrFail({
      _id: _currentUserId,
    });

    if (
      !geolocation?.coordinates[1] ||
      !filterMaxAge ||
      !filterMinAge ||
      !gender ||
      !filterGender ||
      !filterMaxDistance
    ) {
      throw new BadRequestException({
        errorCode: HttpErrorCodes.YOU_DO_NOT_HAVE_BASIC_INFO,
        message: 'You do not have a basic info. Please complete it!',
      });
    }

    if (cursor && cursor >= filterMaxDistance) {
      return {
        data: [],
      };
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
          ...(cursor
            ? {
                minDistance: cursor,
              }
            : {}),
          maxDistance: filterMaxDistance,
          // distanceMultiplier: 0.001,
          query: {
            _id: excludedUserIds.length
              ? {
                  $nin: [
                    ...excludedUserIds.map((item) =>
                      this.userModel.getObjectId(item),
                    ),
                    _currentUserId,
                  ],
                }
              : {
                  $ne: _currentUserId,
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
        },
      },
      { $limit: 20 },
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
          nickname: 1,
          status: 1,
          lastActivatedAt: 1,
          createdAt: 1,
          birthday: 1,
          filterGender: 1,
          filterMaxAge: 1,
          filterMaxDistance: 1,
          filterMinAge: 1,
          gender: 1,
          relationshipGoal: 1,
          distance: 1,
          mediaFiles: 1,
        },
      },
    ]);

    return {
      type: 'nearbyUsers',
      data: users,
    };
  }

  public async findOneOrFailById(targetUserId: string, clientData: ClientData) {
    const { id: currentUserId } = clientData;
    if (targetUserId === currentUserId) {
      throw new BadRequestException({
        errorCode: HttpErrorCodes.CONFLICT_USER,
        message: 'You cannot find yourself!',
      });
    }
    const _targetUserId = this.userModel.getObjectId(targetUserId);
    const findResult = await this.userModel.findOneOrFail({
      _id: _targetUserId,
    });

    return findResult;
  }
}
