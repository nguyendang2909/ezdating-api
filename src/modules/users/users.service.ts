import { Injectable } from '@nestjs/common';
import { And, LessThan, Not } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { CountryEntity } from '../countries/country-entity.service';
import { StateEntity } from '../states/state-entity.service';
import { UploadFileEntity } from '../upload-files/upload-file-entity.service';
import { FindManyDatingUsersDto } from './dto/find-many-dating-users.dto';
import { FindOneUserDto } from './dto/is-exist-user.dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { UpdateMyProfileBasicInfoDto } from './dto/update-profile-basic-info.dto';
import { User } from './entities/user.entity';
import { UserStatuses } from './users.constant';
import { UserEntity } from './users-entity.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly userEntity: UserEntity,
    private readonly uploadFileEntity: UploadFileEntity,
    private readonly stateEntity: StateEntity,
    private readonly countryEntity: CountryEntity,
  ) {}

  public async findManyDating(
    queryParams: FindManyDatingUsersDto,
    currentUserId: string,
  ) {
    const { cursor } = queryParams;
    const whereId = cursor
      ? And(Not(currentUserId), LessThan(cursor))
      : Not(currentUserId);
    const findResult = await this.userEntity.findMany({
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
        location: true,
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
  ): Promise<{ data: User[] }> {
    const { cursor } = queryParams;
    const whereId = cursor
      ? And(Not(currentUserId), LessThan(cursor))
      : Not(currentUserId);
    const findResult = await this.userEntity.findMany({
      where: {
        id: whereId,
        haveBasicInfo: true,
        status: UserStatuses.activated,
      },
      select: {
        id: true,
      },
    });
    // const data = this.repository.find({
    //   where: {
    //   id: Raw(alias => ${alias} < ${id} and ${alias} in (${ids})),
    //   },
    //   });
    return { data: findResult };
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
    const findResult = await this.userEntity.findOne({
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
    const findResult = await this.userEntity.findOneOrFail({
      where: { id },
    });

    return findResult;
  }

  public async getProfile(currentUserId: string) {
    // eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
    const { password, ...userPart } = await this.userEntity.findOneOrFail({
      where: {
        id: currentUserId,
      },
      relations: {
        uploadFiles: true,
        avatarFile: true,
      },
    });

    const formattedProfile = {
      ...userPart,
      avatar: userPart.avatarFile?.location,
    };

    return formattedProfile;
  }

  public async updateProfile(
    payload: UpdateMyProfileDto,
    currentUserId: string,
  ) {
    const { avatarFileId, longitude, latitude, stateId, ...updateDto } =
      payload;

    const updateOptions: QueryDeepPartialEntity<User> = {
      ...updateDto,
      ...(longitude && latitude
        ? {
            location: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
          }
        : {}),
    };

    if (avatarFileId) {
      await this.uploadFileEntity.findOneOrFail({
        where: {
          id: avatarFileId,
          user: {
            id: currentUserId,
          },
        },
      });
      updateOptions.avatarFile = { id: avatarFileId };
    }

    if (stateId) {
      await this.stateEntity.findOneOrFail({
        where: { id: stateId },
      });
      updateOptions.state = {
        id: stateId,
      };
    }

    return await this.userEntity.updateOneById(
      currentUserId,
      updateOptions,
      currentUserId,
    );
  }

  public async updateProfileBasicInfo(
    payload: UpdateMyProfileBasicInfoDto,
    currentUserId: string,
  ) {
    const { stateId, ...updateDto } = payload;
    await this.stateEntity.findOneOrFail({
      where: { id: stateId },
    });
    const updateOptions: QueryDeepPartialEntity<User> = {
      ...updateDto,
      state: { id: stateId },
      haveBasicInfo: true,
    };
    return await this.userEntity.updateOneById(
      currentUserId,
      updateOptions,
      currentUserId,
    );
  }

  public async deactivate(userId: string) {
    return await this.userEntity.updateOneById(
      userId,
      {
        status: UserStatuses.activated,
      },
      userId,
    );
  }
}
