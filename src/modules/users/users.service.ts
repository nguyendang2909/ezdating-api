import { Injectable } from '@nestjs/common';
import { And, LessThan, Not } from 'typeorm';

import { UserStatuses } from '../../commons/constants/constants';
import { ResponsePagination } from '../../commons/constants/paginations';
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

  public async findManyDating(
    queryParams: FindManyDatingUsersDto,
    currentUserId: string,
  ) {
    const { cursor } = queryParams;
    const whereId = cursor
      ? And(Not(currentUserId), LessThan(cursor))
      : Not(currentUserId);
    const findResult = await this.userModel.findMany({
      where: {
        id: whereId,
        haveBasicInfo: true,
        status: UserStatuses.activated,
      },
      relations: ['state', 'state.country'],
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      select: {
        id: true,
        birthday: true,
        gender: true,
        introduce: true,
        geoLocation: true,
        nickname: true,
        state: {
          id: true,
          country: {
            id: true,
          },
        },
        lastActivatedAt: true,
      },
      order: {},
    });

    return { data: findResult, pagination: { cursor: {} } };
  }

  // https://stackoverflow.com/questions/67435650/storing-geojson-points-and-finding-points-within-a-given-distance-radius-nodej
  public async findManyNearby(
    queryParams: FindManyDatingUsersDto,
    currentUserId: string,
  ): Promise<ResponsePagination<User[]>> {
    const { cursor } = queryParams;
    const whereId = cursor
      ? And(Not(currentUserId), LessThan(cursor))
      : Not(currentUserId);
    const findResult = await this.userModel.findMany({
      where: {
        id: whereId,
        haveBasicInfo: true,
        status: UserStatuses.activated,
      },
    });
    // const data = this.repository.find({
    //   where: {
    //   id: Raw(alias => ${alias} < ${id} and ${alias} in (${ids})),
    //   },
    //   });
    return {
      type: 'nearbyUsers',
      data: findResult,
      pagination: {
        cursors: {
          before: null,
          after: null,
        },
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
}
