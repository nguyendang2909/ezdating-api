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

    const users = await this.userModel.model
      .aggregate()
      .append({
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
        },
      })
      .match({
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
        distance: {
          ...(cursorValue
            ? {
                $gt: cursorValue,
              }
            : {}),
          $lte: filterMaxDistance,
        },
      });

    return {
      data: users,
      pagination: {
        cursors: this.userModel.getCursors({
          after: _.last(users)?.distance?.toString(),
          before: null,
        }),
      },
    };

    // // const results = await this.userModel
    // //   .createQueryBuilder()
    // //   .leftJoinAndSelect('User.uploadFiles', 'UploadFiles')
    // //   .addSelect([
    // //     // User
    // //     `ST_Distance(ST_MakePoint(${geolocation.coordinates[0]}, ${geolocation.coordinates[1]}), "User"."geolocation") AS "distance"`,
    // //   ])
    // //   .where('User.have_basic_info = true')
    // //   .orderBy('distance', 'ASC')
    // //   .getRawMany();

    // // const entities = results.reduce(
    // //   (acc: User[], rawEntity: Record<string, any>) => {
    // //     let user = acc.find((entity) => entity.id === rawEntity.User_id);

    // //     console.log(rawEntity);

    // //     const uploadFile = new UploadFile({
    // //       id: rawEntity.UploadFiles_id,
    // //       userId: rawEntity.UploadFiles_user_id,
    // //       type: rawEntity.UploadFiles_type,
    // //       location: rawEntity.UploadFiles_location,
    // //     });

    // //     if (!user) {
    // //       user = new User({
    // //         id: rawEntity.User_id,
    // //         educationLevel: rawEntity.User_education_level,
    // //         gender: rawEntity.User_gender,
    // //         height: rawEntity.User_height,
    // //         weight: rawEntity.User_weight,
    // //         introduce: rawEntity.User_introduce,
    // //         lookingFor: rawEntity.User_looking_for,
    // //         avatarFileId: rawEntity.User_avatar_file_id,
    // //         uploadFiles: [],
    // //         // avatarFile: {
    // //         //   id: rawEntity.UploadFiles_id,
    // //         //   userId: rawEntity.UploadFiles_user_id,
    // //         //   type: rawEntity.UploadFiles_type,
    // //         //   location: rawEntity.UploadFiles_location,
    // //         // },
    // //       });
    // //       acc.push(user);
    // //     }

    // //     user.uploadFiles.push(uploadFile);

    // //     if (uploadFile.id === rawEntity.User_avatar_file_id) {
    // //       user.avatarFile = uploadFile;
    // //       user.avatar = uploadFile.location;
    // //     }

    // //     return acc;
    // //   },
    // //   [],
    // // );

    // console.log(user);

    // const rawUsers = await this.userModel.query(
    //   `SELECT
    //     "User".*,
    //     date_part('year',age(birthday)) as age,
    //     "AvatarFile"."id" AS avatarfile_id,
    //     "AvatarFile"."location" AS avatarfile_location,
    //     "AvatarFile"."type" AS avatarfile_type,
    //     "UploadFiles".*,
    //     ST_Distance(ST_MakePoint($1, $2 ), "User"."geolocation") AS distance
    //   FROM "user" "User"
    //   LEFT JOIN "upload_file" "AvatarFile" ON "User"."avatar_file_id" = "AvatarFile"."id"
    //   LEFT JOIN "upload_file" "UploadFiles" ON "User"."id" = "UploadFiles"."user_id"
    //   WHERE
    //     ${this.getQueryDistance(extractCursor)}
    //     AND "User"."have_basic_info" = true
    //     AND "User"."avatar_file_id" IS NOT NULL
    //     AND "User"."id" <> $3
    //     AND "User"."gender"=$4
    //     AND "User".birthday BETWEEN $5 AND $6
    //     AND NOT EXISTS (
    //       SELECT 1 FROM "relationship" "Relationship"
    //       WHERE
    //         "Relationship"."user_one_id" = $3
    //         AND "Relationship"."user_two_id" = "User"."id"
    //         AND "Relationship"."user_two_status" <> $7
    //         AND "Relationship"."user_one_status" <> $8
    //     )
    //     AND NOT EXISTS (
    //       SELECT 1 FROM "relationship" "Relationship"
    //       WHERE
    //         "Relationship"."user_two_id" = $3
    //         AND "Relationship"."user_one_id" = "User"."id"
    //         AND "Relationship"."user_one_status" <> $8
    //         AND "Relationship"."user_two_status" <> $7
    //       )
    //   ORDER BY
    //     "distance",
    //     "User"."id"
    //   LIMIT 20
    //   ;`,
    //   [
    //     geolocation.coordinates[0],
    //     geolocation.coordinates[1],
    //     currentUserId,
    //     filterGender,
    //     filterMinBirthday,
    //     filterMaxBirthday,
    //     RelationshipUserStatuses.block,
    //     RelationshipUserStatuses.block,
    //     100000,
    //   ],
    // );

    // return {
    //   type: 'nearbyUsers',
    //   data: this.userModel.formatRaws(rawUsers),
    //   pagination: {
    //     cursors: EntityFactory.getCursors({
    //       before: _.first<{ distance: number }>(rawUsers)?.distance,
    //       after: _.last<{ distance: number }>(rawUsers)?.distance,
    //     }),
    //   },
    // };
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
