import { BadRequestException, Injectable } from '@nestjs/common';
import moment from 'moment';

import { UserStatuses } from '../../commons/constants';
import { HttpErrorMessages } from '../../commons/erros/http-error-messages.constant';
import { ApiService } from '../../commons/services/api.service';
import { PaginatedResponse, Pagination } from '../../commons/types';
import { ClientData } from '../auth/auth.type';
import { User, UserDocument } from '../models/schemas/user.schema';
import { UserModel } from '../models/user.model';
import { FindManyNearbyUsersQuery } from './dto/find-nearby-users.dto';
@Injectable()
export class NearbyUsersService extends ApiService {
  constructor(private readonly userModel: UserModel) {
    super();
  }

  public async findMany(
    queryParams: FindManyNearbyUsersQuery,
    clientData: ClientData,
  ): Promise<PaginatedResponse<User>> {
    const { _next } = queryParams;

    const cursor = this.decodeToObj<{ _id: string; distance: number }>(_next);

    const minDistance = cursor?.distance || undefined;
    const _minUserId = cursor?._id ? this.getObjectId(cursor._id) : undefined;

    const { id: currentUserId } = clientData;
    const _currentUserId = this.getObjectId(currentUserId);
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
            ...(minDistance
              ? {
                  minDistance: minDistance,
                }
              : {}),
            maxDistance: filterMaxDistance,
            // distanceMultiplier: 0.001,
            query: {
              _id: {
                ...(!minDistance || minDistance === 0
                  ? { $ne: _currentUserId }
                  : {}),
                ...(_minUserId ? { $gt: _minUserId } : {}),
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
    return this.getPaginationByField(data, ['_id', 'distance']);
  }
}
