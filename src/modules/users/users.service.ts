import { Injectable } from '@nestjs/common';

import { ApiService } from '../../commons/services/api.service';
import { UserModel } from '../models/user.model';
@Injectable()
export class UsersService extends ApiService {
  constructor(
    private readonly userModel: UserModel, // private readonly stateModel: StateModel, // private readonly countryModel: CountryModel,
  ) {
    super();
  }

  // public async findManySwipe(
  //   queryParams: FindManyDatingUsersQuery,
  //   clientData: ClientData,
  // ) {
  //   const { minDistance, excludedUserId } = queryParams;
  //   const excludedUserIds =
  //     excludedUserId && isArray(excludedUserId) ? excludedUserId : [];
  //   const { id: currentUserId } = clientData;
  //   const _currentUserId = this.getObjectId(currentUserId);

  //   const user = await this.userModel.findOneOrFail({
  //     _id: _currentUserId,
  //   });

  //   const {
  //     geolocation,
  //     filterMaxAge,
  //     filterMinAge,
  //     filterMaxDistance,
  //     filterGender,
  //     gender,
  //   } = user;

  //   if (!user.geolocation) {
  //     throw new BadRequestException();
  //   }

  //   if (
  //     !geolocation?.coordinates[1] ||
  //     !filterMaxAge ||
  //     !filterMinAge ||
  //     !gender ||
  //     !filterGender ||
  //     !filterMaxDistance
  //   ) {
  //     throw new BadRequestException({
  //       message:
  //         HttpErrorMessages[
  //           'You do not have a basic info. Please complete it!'
  //         ],
  //     });
  //   }

  //   const filterMaxBirthday = moment().subtract(filterMinAge, 'years').toDate();
  //   const filterMinBirthday = moment().subtract(filterMaxAge, 'years').toDate();

  //   const users = await this.userModel.aggregate([
  //     {
  //       $geoNear: {
  //         near: {
  //           type: 'Point',
  //           coordinates: [
  //             geolocation.coordinates[0],
  //             geolocation.coordinates[1],
  //           ],
  //         },
  //         distanceField: 'distance',
  //         ...(minDistance
  //           ? {
  //               minDistance: +minDistance,
  //             }
  //           : {}),
  //         maxDistance: filterMaxDistance,
  //         // distanceMultiplier: 0.001,
  //         query: {
  //           _id: {
  //             ...(excludedUserIds.length
  //               ? {
  //                   $nin: [
  //                     _currentUserId,
  //                     ...excludedUserIds.map((item) => this.getObjectId(item)),
  //                   ],
  //                 }
  //               : {
  //                   $ne: _currentUserId,
  //                 }),
  //           },
  //           status: {
  //             $in: [UserStatuses.activated, UserStatuses.verified],
  //           },
  //           // lastActivatedAt: {
  //           //   $gt: moment().subtract(7, 'd').toDate(),
  //           // },
  //           birthday: {
  //             $gt: filterMinBirthday,
  //             $lt: filterMaxBirthday,
  //           },
  //           gender: filterGender,
  //         },
  //       },
  //     },
  //     {
  //       $sort: {
  //         lastActivatedAt: -1,
  //       },
  //     },
  //     { $limit: 20 },
  //     {
  //       $lookup: {
  //         from: 'mediafiles',
  //         let: {
  //           userId: '$_id',
  //         },
  //         pipeline: [
  //           {
  //             $match: {
  //               $expr: {
  //                 $eq: ['$_userId', '$$userId'],
  //               },
  //             },
  //           },
  //           {
  //             $limit: 6,
  //           },
  //           {
  //             $project: {
  //               _id: true,
  //               location: true,
  //             },
  //           },
  //         ],
  //         as: 'mediaFiles',
  //       },
  //     },
  //     {
  //       $set: {
  //         age: {
  //           $dateDiff: {
  //             startDate: '$birthday',
  //             endDate: '$$NOW',
  //             unit: 'year',
  //           },
  //         },
  //       },
  //     },
  //     {
  //       $project: {
  //         age: 1,
  //         distance: 1,
  //         educationLevel: 1,
  //         gender: 1,
  //         height: 1,
  //         introduce: 1,
  //         jobTitle: 1,
  //         languages: 1,
  //         lastActivatedAt: 1,
  //         mediaFiles: 1,
  //         nickname: 1,
  //         relationshipGoal: 1,
  //         relationshipStatus: 1,
  //         role: 1,
  //         school: 1,
  //         status: 1,
  //         weight: 1,
  //       },
  //     },
  //   ]);

  //   return {
  //     type: 'swipeUsers',
  //     data: users,
  //   };
  // }

  // public async findManyNearby(
  //   queryParams: FindManyNearbyUsersQuery,
  //   clientData: ClientData,
  // ): Promise<PaginatedResponse<User>> {
  //   const { excludedUserId, _next } = queryParams;
  //   const excludedUserIds =
  //     excludedUserId && isArray(excludedUserId) ? excludedUserId : [];
  //   const cursor = _next ? JSON.parse(_next) : undefined;
  //   const { id: currentUserId } = clientData;
  //   const _currentUserId = this.userModel.getObjectId(currentUserId);
  //   const {
  //     geolocation,
  //     filterMaxAge,
  //     filterMinAge,
  //     filterMaxDistance,
  //     filterGender,
  //     gender,
  //   } = await this.userModel.findOneOrFail({
  //     _id: _currentUserId,
  //   });

  //   if (
  //     !geolocation?.coordinates[1] ||
  //     !filterMaxAge ||
  //     !filterMinAge ||
  //     !gender ||
  //     !filterGender ||
  //     !filterMaxDistance
  //   ) {
  //     throw new BadRequestException({
  //       message:
  //         HttpErrorMessages[
  //           'You do not have a basic info. Please complete it!'
  //         ],
  //     });
  //   }

  //   if (cursor && cursor >= filterMaxDistance) {
  //     return {
  //       data: [],
  //       type: 'nearbyUsers',
  //       pagination: {
  //         _next: null,
  //       },
  //     };
  //   }

  //   const filterMaxBirthday = moment().subtract(filterMinAge, 'years').toDate();
  //   const filterMinBirthday = moment().subtract(filterMaxAge, 'years').toDate();

  //   const users: User[] = await this.userModel.model
  //     .aggregate([
  //       {
  //         $geoNear: {
  //           near: {
  //             type: 'Point',
  //             coordinates: [
  //               geolocation.coordinates[0],
  //               geolocation.coordinates[1],
  //             ],
  //           },
  //           distanceField: 'distance',
  //           ...(cursor
  //             ? {
  //                 minDistance: cursor,
  //               }
  //             : {}),
  //           maxDistance: filterMaxDistance,
  //           // distanceMultiplier: 0.001,
  //           query: {
  //             _id: excludedUserIds.length
  //               ? {
  //                   $nin: [
  //                     ...excludedUserIds.map((item) =>
  //                       this.userModel.getObjectId(item),
  //                     ),
  //                     _currentUserId,
  //                   ],
  //                 }
  //               : {
  //                   $ne: _currentUserId,
  //                 },
  //             status: {
  //               $in: [UserStatuses.activated, UserStatuses.verified],
  //             },
  //             // lastActivatedAt: {
  //             //   $gt: moment().subtract(7, 'd').toDate(),
  //             // },
  //             birthday: {
  //               $gt: filterMinBirthday,
  //               $lt: filterMaxBirthday,
  //             },
  //             gender: filterGender,
  //           },
  //         },
  //       },
  //       {
  //         $sort: {
  //           distance: 1,
  //         },
  //       },
  //       { $limit: 20 },
  //       {
  //         $lookup: {
  //           from: 'mediafiles',
  //           let: {
  //             userId: '$_id',
  //           },
  //           pipeline: [
  //             {
  //               $match: {
  //                 $expr: {
  //                   $eq: ['$_userId', '$$userId'],
  //                 },
  //               },
  //             },
  //             {
  //               $limit: 6,
  //             },
  //             {
  //               $project: {
  //                 _id: true,
  //                 location: true,
  //               },
  //             },
  //           ],
  //           as: 'mediaFiles',
  //         },
  //       },
  //       {
  //         $set: {
  //           age: {
  //             $dateDiff: {
  //               startDate: '$birthday',
  //               endDate: '$$NOW',
  //               unit: 'year',
  //             },
  //           },
  //         },
  //       },
  //       {
  //         $project: {
  //           age: 1,
  //           birthday: 1,
  //           createdAt: 1,
  //           distance: 1,
  //           filterGender: 1,
  //           filterMaxAge: 1,
  //           filterMaxDistance: 1,
  //           filterMinAge: 1,
  //           gender: 1,
  //           lastActivatedAt: 1,
  //           mediaFiles: 1,
  //           nickname: 1,
  //           relationshipGoal: 1,
  //           status: 1,
  //         },
  //       },
  //     ])
  //     .exec();

  //   return {
  //     type: 'nearbyUsers',
  //     data: users,
  //     pagination: {
  //       _next: _.last(users)?.distance || null,
  //     },
  //   };
  // }

  public async findOneById(targetUserId: string) {
    const _targetUserId = this.getObjectId(targetUserId);
    const findResult = await this.userModel.model
      .aggregate([
        {
          $match: {
            _id: _targetUserId,
          },
        },
        {
          $limit: 1,
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
          $project: this.userModel.matchUserFields,
        },
      ])
      .exec();

    return findResult;
  }
}
