import { BadRequestException, Injectable } from '@nestjs/common';
import { isArray } from 'lodash';
import moment from 'moment';

import { CommonService } from '../../commons/common.service';
import { UserStatuses } from '../../commons/constants';
import { HttpErrorMessages } from '../../commons/erros/http-error-messages.constant';
import { PaginatedResponse, Pagination } from '../../commons/types';
import { ClientData } from '../auth/auth.type';
import { User, UserDocument } from '../models/schemas/user.schema';
import { UserModel } from '../models/user.model';
import { FindManyNearbyUsersQuery } from './dto/find-nearby-users.dto';
@Injectable()
export class NearbyUsersService extends CommonService {
  constructor(private readonly userModel: UserModel) {
    super();
  }

  public async findMany(
    queryParams: FindManyNearbyUsersQuery,
    clientData: ClientData,
  ): Promise<PaginatedResponse<User>> {
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
        message:
          HttpErrorMessages[
            'You do not have a basic info. Please complete it!'
          ],
      });
    }

    if (cursor && cursor >= filterMaxDistance) {
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

    const findResults: UserDocument[] = await this.userModel.model
      .aggregate([
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
            birthday: 1,
            createdAt: 1,
            distance: 1,
            filterGender: 1,
            filterMaxAge: 1,
            filterMaxDistance: 1,
            filterMinAge: 1,
            gender: 1,
            lastActivatedAt: 1,
            mediaFiles: 1,
            nickname: 1,
            relationshipGoal: 1,
            status: 1,
          },
        },
      ])
      .exec();

    return {
      type: 'nearbyUsers',
      data: findResults,
      pagination: this.getPagination(findResults),
    };
  }

  public getPagination(data: UserDocument[]): Pagination {
    return this.getPaginationByField('distance', data);
  }
}