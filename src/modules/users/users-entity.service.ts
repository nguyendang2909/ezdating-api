import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { FindOneOptions, FindOptionsSelect, Repository } from 'typeorm';

import {
  EntityFindManyOptions,
  EntityFindOneOptions,
} from '../../commons/types/find-options.type';
import { FindOneUserByIdDto } from './dto/find-one-user-by-id.dto';
import { User } from './entities/user.entity';
import { EUserStatus } from './users.constant';

@Injectable()
export class UserEntity {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public async findOne(
    options: EntityFindOneOptions<User>,
  ): Promise<Partial<User> | null> {
    if (_.isEmpty(options.where)) {
      return null;
    }
    return await this.userRepository.findOne(options);
  }

  public async findOneOrFail(
    options: EntityFindOneOptions<User>,
  ): Promise<Partial<User>> {
    const findResult = await this.findOne(options);
    if (!findResult) {
      throw new NotFoundException('User not found!');
    }
    return findResult;
  }

  public async findOneById(id: string, findOneUserByIdDto: FindOneUserByIdDto) {
    const { f } = findOneUserByIdDto;
    const findResult = await this.userRepository.findOne({
      where: {
        id,
      },
      select: f,
    });
    return findResult;
  }

  public async findOneOrFailById(
    id: string,
    findOneUserByIdDto: FindOneUserByIdDto,
  ) {
    const findResult = await this.findOneById(id, findOneUserByIdDto);
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

  public isUserOneByIds(userId: string, userIds: string[]): boolean {
    return userId === userIds[0];
  }

  public isUserOneByEntities(userId: string, entities: User[]) {
    return userId === entities[0]?.id;
  }
}
