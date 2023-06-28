import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import {
  FindOneOptions,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import {
  EntityFindManyOptions,
  EntityFindOneByIdOptions,
} from '../../commons/types/find-options.type';
import { User } from './entities/user.entity';
import { EUserStatus } from './users.constant';

@Injectable()
export class UserEntity {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public async saveOne(entity: Partial<User>): Promise<User> {
    const { phoneNumber } = entity;
    if (!phoneNumber) {
      throw new BadRequestException('Phone number does not exist!');
    }
    const user = this.userRepository.create({ phoneNumber });

    return await this.userRepository.save(user);
  }

  public async findOne(options: FindOneOptions<User>): Promise<User | null> {
    if (_.isEmpty(options.where)) {
      return null;
    }
    return await this.userRepository.findOne(options);
  }

  public async findOneOrFail(options: FindOneOptions<User>): Promise<User> {
    const findResult = await this.findOne(options);
    if (!findResult) {
      throw new BadRequestException({
        errorCode: 'USER_DOES_NOT_EXIST',
        message: "User doesn't exist!",
      });
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

  public async findOneById(
    id: string,
    findOptions: EntityFindOneByIdOptions<User>,
  ) {
    if (!id) {
      return null;
    }
    return await this.userRepository.findOne({
      ...findOptions,
      where: { id },
    });
  }

  public async findOneOrFailById(
    id: string,
    findOptions: Omit<FindOneOptions<User>, 'select' | 'where'> & {
      select: FindOptionsSelect<User> & { status: true };
    },
  ) {
    const findResult = await this.findOneById(id, findOptions);
    if (!findResult) {
      throw new BadRequestException({
        errorCode: 'USER_DOES_NOT_EXIST',
        message: "User doesn't exist!",
      });
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

  public async findOneByIdAndValidate(
    id: string,
    options: Omit<FindOneOptions<User>, 'select' | 'where'> & {
      select: FindOptionsSelect<User> & { status: true };
    },
  ): Promise<User | null> {
    const user = await this.userRepository.findOne(options);
    if (!user || user.status === EUserStatus.banned) {
      return null;
    }
    return user;
  }

  public async findMany(options: EntityFindManyOptions<User>) {
    return await this.userRepository.find(options);
  }

  public async updateOne(
    findOptions: FindOptionsWhere<User>,
    updateOptions: QueryDeepPartialEntity<User>,
  ) {
    return await this.userRepository.update(findOptions, updateOptions);
  }

  public isUserOneByIds(userId: string, userIds: string[]): boolean {
    return userId === userIds[0];
  }

  public isUserOneByEntities(userId: string, entities: User[]) {
    return userId === entities[0]?.id;
  }
}
