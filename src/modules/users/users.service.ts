import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import _ from 'lodash';
import { And, LessThan, Not } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { UploadFileEntity } from '../upload-files/upload-file-entity.service';
import { FindManyDatingUsersDto } from './dto/find-many-dating-users.dto';
import { FindOneUserByIdDto } from './dto/find-one-user-by-id.dto';
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
    // @Inject(forwardRef(() => UploadFileEntity))
    private readonly uploadFileEntity: UploadFileEntity,
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
      },
      order: {},
    });

    return { data: findResult, pagination: { cursor: {} } };
  }

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

  public async findOneOrFail(
    findOneUserDto: FindOneUserDto,
    currentUserId: string,
  ) {
    const findResult = await this.findOne(findOneUserDto, currentUserId);
    if (!findResult) {
      throw new NotFoundException('User not found!');
    }

    return findResult;
  }

  public async findOneById(
    id: string,
    findOneUserByIdDto: FindOneUserByIdDto,
    currentUserId: string,
  ) {
    const findResult = await this.userEntity.findOne({
      where: {
        id,
      },
    });

    return findResult;
  }

  public async findOneOrFailById(
    id: string,
    findOneUserByIdDto: FindOneUserByIdDto,
    currentUserId: string,
  ) {
    const findResult = await this.findOneById(
      id,
      findOneUserByIdDto,
      currentUserId,
    );
    if (!findResult) {
      throw new BadRequestException('User not found!');
    }
    const { status } = findResult;
    if (!status || status === UserStatuses.banned) {
      throw new BadRequestException({
        message: 'User has been banned',
        errorCode: 'USER_BANNED',
      });
    }

    return findResult;
  }

  public async getProfile(currentUserId: string) {
    const user = await this.userEntity.findOneOrFail({
      where: {
        id: currentUserId,
      },
      relations: {
        uploadFiles: true,
      },
    });

    return _.omit<User>(user, ['password']);
  }

  public async updateProfile(
    payload: UpdateMyProfileDto,
    currentUserId: string,
  ) {
    const { avatarFileId, ...updateDto } = payload;

    if (avatarFileId) {
      await this.uploadFileEntity.findOneOrFail({
        where: {
          id: avatarFileId,
          user: {
            id: currentUserId,
          },
        },
      });
    }

    const updateOptions: QueryDeepPartialEntity<User> = {
      ...(avatarFileId ? { avatarFile: { id: avatarFileId } } : {}),
      ...updateDto,
    };

    return await this.userEntity.updateOneById(currentUserId, updateOptions);
  }

  public async updateProfileBasicInfo(
    payload: UpdateMyProfileBasicInfoDto,
    currentUserId: string,
  ) {
    const { stateId, ...updateDto } = payload;
    const updateOptions: QueryDeepPartialEntity<User> = {
      ...updateDto,
      state: { id: stateId },
      haveBasicInfo: true,
    };
    return await this.userEntity.updateOneById(currentUserId, updateOptions);
  }

  public async deactivate(userId: string) {
    return await this.userEntity.updateOneById(userId, {
      status: UserStatuses.activated,
    });
  }
}
