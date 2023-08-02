import { BadRequestException, Injectable } from '@nestjs/common';
import _ from 'lodash';
import moment from 'moment';

import { RelationshipUserStatuses } from '../../commons/constants/constants';
import {
  Cursors,
  ResponsePagination,
} from '../../commons/constants/paginations';
import { HttpErrorCodes } from '../../commons/erros/http-error-codes.constant';
import { EntityFactory } from '../../commons/lib/entity-factory';
import { ExtractCursor } from '../../commons/types';
import { User } from '../entities/entities/user.entity';
import { StateModel } from '../entities/state.model';
import { UploadFileModel } from '../entities/upload-file.model';
import { UserModel } from '../entities/user.model';
import { FindManyDatingUsersDto } from './dto/find-many-dating-users.dto';
import { FindOneUserDto } from './dto/is-exist-user.dto';
@Injectable()
export class UsersService {
  constructor(
    private readonly userModel: UserModel,
    private readonly uploadFileModel: UploadFileModel,
    private readonly stateModel: StateModel, // private readonly countryModel: CountryModel,
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

    const rawUsers = await this.userModel.query(
      `SELECT *, ST_Distance(ST_MakePoint(${user.geolocation.coordinates[0]}, ${user.geolocation.coordinates[1]} ), "user"."geolocation") FROM "user";`,
    );

    return rawUsers;

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
  public async findManyNearby(
    queryParams: FindManyDatingUsersDto,
    currentUserId: string,
  ): Promise<ResponsePagination<User>> {
    const { cursor } = queryParams;

    const extractCursor = EntityFactory.extractCursor(cursor);

    const {
      geolocation,
      filterMaxAge,
      filterMinAge,
      filterMaxDistance,
      filterGender,
      gender,
      haveBasicInfo,
    } = await this.userModel.findOneOrFail({
      where: {
        id: currentUserId,
      },
    });

    if (
      !haveBasicInfo ||
      !geolocation ||
      !filterMaxAge ||
      !filterMaxAge ||
      !gender ||
      !filterGender ||
      !filterMaxDistance
    ) {
      throw new BadRequestException({
        errorCode: HttpErrorCodes.YOU_DO_NOT_HAVE_BASIC_INFO,
        message: 'You do not have a basic info. Please complete it!',
      });
    }

    if (extractCursor?.value && +extractCursor.value >= filterMaxDistance) {
      return {
        type: 'nearbyUsers',
        data: [],
        pagination: {
          cursors: EntityFactory.getCursors({
            before: filterMaxDistance,
            after: null,
          }),
        },
      };
    }

    const filterMaxBirthday = moment()
      .subtract(filterMinAge, 'years')
      .format('YYYY-MM-DD');
    const filterMinBirthday = moment()
      .subtract(filterMaxAge, 'years')
      .format('YYYY-MM-DD');

    const rawUsers = await this.userModel.query(
      `SELECT
        "User".*,
        "AvatarFile"."id" AS avatarfile_id,
        "AvatarFile"."location" AS avatarfile_location,
        "AvatarFile"."type" AS avatarfile_type,
        ST_Distance(ST_MakePoint($1, $2 ), "User"."geolocation") AS distance
      FROM "user" "User"
      LEFT JOIN "upload_file" "AvatarFile" ON "User"."avatar_file_id" = "AvatarFile"."id"
      WHERE
        ${this.getQueryDistance(extractCursor)}
        AND "User"."have_basic_info" = true
        AND "User"."avatar_file_id" IS NOT NULL
        AND "User"."id" <> $3
        AND "User"."gender"=$4
        AND "User".birthday BETWEEN $5 AND $6
        AND NOT EXISTS (
          SELECT 1 FROM "relationship" "Relationship"
          WHERE
            "Relationship"."user_one_id" = $3
            AND "Relationship"."user_two_id" = "User"."id"
            AND "Relationship"."user_two_status" <> $7
            AND "Relationship"."user_one_status" <> $8
        )
        AND NOT EXISTS (
          SELECT 1 FROM "relationship" "Relationship"
          WHERE
            "Relationship"."user_two_id" = $3
            AND "Relationship"."user_one_id" = "User"."id"
            AND "Relationship"."user_one_status" <> $8
            AND "Relationship"."user_two_status" <> $7
          )
      ORDER BY
        "distance",
        "User"."id"
      LIMIT 20
      ;`,
      [
        geolocation.coordinates[0],
        geolocation.coordinates[1],
        currentUserId,
        filterGender,
        filterMinBirthday,
        filterMaxBirthday,
        RelationshipUserStatuses.block,
        RelationshipUserStatuses.block,
        100000,
      ],
    );

    return {
      type: 'nearbyUsers',
      data: this.userModel.formatRaws(rawUsers),
      pagination: {
        cursors: EntityFactory.getCursors({
          before: _.first<{ distance: number }>(rawUsers)?.distance,
          after: _.last<{ distance: number }>(rawUsers)?.distance,
        }),
      },
    };
  }

  public async findOne(
    findOneUserDto: FindOneUserDto,
    currentUserId: string,
  ): Promise<Partial<User> | null> {
    let phoneNumber = findOneUserDto.phoneNumber;
    if (!phoneNumber) {
      return null;
    }
    if (!phoneNumber.startsWith('+')) {
      phoneNumber = `+${phoneNumber.trim()}`;
    }
    const findResult = await this.userModel.findOne({
      where: {
        ...(phoneNumber ? { phoneNumber } : {}),
      },
      select: {
        id: true,
      },
    });

    return findResult;
  }

  public async findOneOrFailById(id: string, currentUserId: string) {
    const findResult = await this.userModel.findOneOrFail({
      where: { id },
    });

    return findResult;
  }

  getQueryDistance(extractCursor: ExtractCursor) {
    if (!extractCursor) {
      return `ST_Distance(ST_MakePoint($1, $2 ), "User"."geolocation") <= $9`;
    }

    if (extractCursor.type === Cursors.before) {
      throw new BadRequestException('Not implemented');
    }

    return `ST_Distance(ST_MakePoint($1, $2 ), "User"."geolocation") > ${+extractCursor.value} AND ST_Distance(ST_MakePoint($1, $2 ), "User"."geolocation") <= $9`;
  }
}
