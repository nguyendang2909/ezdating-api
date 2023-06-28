import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import _ from 'lodash';
import { And, LessThan, Not } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { FindManyDatingUsersDto } from './dto/find-many-dating-users.dto';
import { FindOneUserByIdDto } from './dto/find-one-user-by-id.dto';
import { FindOneUserDto } from './dto/is-exist-user.dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { UpdateMyProfileBasicInfoDto } from './dto/update-profile-basic-info.dto';
import { User } from './entities/user.entity';
import { EUserStatus } from './users.constant';
import { UserEntity } from './users-entity.service';

@Injectable()
export class UsersService {
  constructor(private readonly userEntity: UserEntity) {}

  public async findManyDating(
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
        status: EUserStatus.activated,
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
        status: EUserStatus.activated,
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
    if (!status || status === EUserStatus.banned) {
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
    const { ...updateDto } = payload;
    const updateOptions: QueryDeepPartialEntity<User> = {
      ...updateDto,
    };
    const updateResult = await this.userEntity.updateOne(
      { id: currentUserId },
      updateOptions,
    );

    return Boolean(updateResult.affected);
  }

  public async updateProfileBasicInfo(
    payload: UpdateMyProfileBasicInfoDto,
    currentUserId: string,
  ) {
    const { ...updateDto } = payload;
    const updateOptions: QueryDeepPartialEntity<User> = {
      ...updateDto,
      haveBasicInfo: true,
    };
    const updateResult = await this.userEntity.updateOne(
      { id: currentUserId },
      updateOptions,
    );

    return Boolean(updateResult.affected);
  }
}
