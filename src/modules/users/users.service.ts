import { BadRequestException, Injectable } from '@nestjs/common';
import _ from 'lodash';
import moment from 'moment';

import { UserStatuses } from '../../commons/constants/constants';
import { ResponsePagination } from '../../commons/constants/paginations';
import { HttpErrorCodes } from '../../commons/erros/http-error-codes.constant';
import { ClientData } from '../auth/auth.type';
import { MediaFileModel } from '../models/media-file.model';
import { UserDocument } from '../models/schemas/user.schema';
import { UserModel } from '../models/user.model';
import { FindManyDatingUsersDto } from './dto/find-many-dating-users.dto';
@Injectable()
export class UsersService {
  constructor(
    private readonly userModel: UserModel,
    private readonly mediaFileModel: MediaFileModel, // private readonly stateModel: StateModel, // private readonly countryModel: CountryModel,
  ) {}

  public async findManySwipe(
    queryParams: FindManyDatingUsersDto,
    currentUserId: string,
  ) {
    const user = await this.userModel.findOneOrFail({
      where: {
        id: currentUserId,
      },
    });

    if (!user.geolocation) {
      throw new BadRequestException();
    }

    // const rawUsers = await this.userModel.query(
    //   `SELECT *, ST_Distance(ST_MakePoint(${user.geolocation.coordinates[0]}, ${user.geolocation.coordinates[1]} ), "user"."geolocation") FROM "user";`,
    // );

    return [];

    // `SELECT * , ST_Distance(ST_MakePoint(${user.geolocation?.coordinates[0]}, ${user.geolocation.coordinates[1]} ), distance_in_meters) AS dist FROM user ORDER BY dist LIMIT 10;`,
    // const { cursor } = queryParams;
    // const whereId = cursor
    //   ? And(Not(currentUserId), LessThan(cursor))
    //   : Not(currentUserId);
    // const findResult = await this.userModel.findMany({
    //   where: {
    //     id: whereId,
    //     haveBasicInfo: true,
    //     status: UserStatuses.activated,
    //   },
    //   relations: ['state', 'state.country'],
    //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //   // @ts-ignore
    //   select: {
    //     id: true,
    //     birthday: true,
    //     gender: true,
    //     introduce: true,
    //     geolocation: true,
    //     nickname: true,
    //     state: {
    //       id: true,
    //       country: {
    //         id: true,
    //       },
    //     },
    //     lastActivatedAt: true,
    //   },
    //   order: {},
    // });
    // return { data: findResult, pagination: { cursor: {} } };
  }

  // https://stackoverflow.com/questions/67435650/storing-geojson-points-and-finding-points-within-a-given-distance-radius-nodej
  // public async findManyNearby(
  //   queryParams: FindManyDatingUsersDto,
  //   currentUserId: string,
  // ): Promise<ResponsePagination<User>> {
  public async findManyNearby(
    queryParams: FindManyDatingUsersDto,
    clientData: ClientData,
  ): Promise<ResponsePagination<UserDocument>> {
    const { after, before } = queryParams;
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

    const cursor = this.userModel.extractCursor(after || before);
    const cursorValue = cursor ? +cursor : undefined;
    if (cursorValue && cursorValue >= filterMaxDistance) {
      return {
        data: [],
        pagination: {
          cursors: { after: null, before: null },
        },
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
          ...(cursorValue
            ? {
                minDistance: cursorValue,
              }
            : {}),
          maxDistance: filterMaxDistance,
          // distanceMultiplier: 0.001,
          query: {
            _id: {
              $ne: _currentUserId,
            },
            status: {
              $in: [UserStatuses.activated, UserStatuses.verified],
            },
            lastActivatedAt: {
              $gt: moment().subtract(7, 'd').toDate(),
            },
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
      data: users,
      pagination: {
        cursors: this.userModel.getCursors({
          after: _.last(users)?.distance?.toString(),
          before: _.first(users).distance?.toString(),
        }),
      },
    };
  }

  // public async findOne(findOneUserDto: FindOneUserDto, currentUserId: string) {
  //   let phoneNumber = findOneUserDto.phoneNumber;
  //   if (!phoneNumber) {
  //     return null;
  //   }
  //   if (!phoneNumber.startsWith('+')) {
  //     phoneNumber = `+${phoneNumber.trim()}`;
  //   }
  //   const findResult = await this.userModel.findOne({
  //     where: {
  //       ...(phoneNumber ? { phoneNumber } : {}),
  //     },
  //     select: {
  //       id: true,
  //     },
  //   });

  //   return findResult;
  // }

  public async findOneOrFailById(targetUserId: string, currentUserId: string) {
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

  // getQueryDistance(extractCursor: ExtractCursor) {
  //   if (!extractCursor) {
  //     return `ST_Distance(ST_MakePoint($1, $2 ), "User"."geolocation") <= $9`;
  //   }

  //   if (extractCursor.type === Cursors.before) {
  //     throw new BadRequestException('Not implemented');
  //   }

  //   return `ST_Distance(ST_MakePoint($1, $2 ), "User"."geolocation") > ${+extractCursor.value} AND ST_Distance(ST_MakePoint($1, $2 ), "User"."geolocation") <= $9`;
  // }
}
