import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { Repository } from 'typeorm';

import { EntityFactory } from '../../commons/lib/entity-factory';
import { EntityFindOneOptions } from '../../commons/types/find-options.type';
import { FindOneUserByIdDto } from './dto/find-one-user-by-id.dto';
import { User } from './entities/user.entity';
import { EUserStatus } from './users.enum';

@Injectable()
export class UsersUtil {
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

  public async findOneById(
    id: string,
    findOneUserByIdDto: FindOneUserByIdDto,
    currentUserId: string,
  ) {
    const { f } = findOneUserByIdDto;
    const findResult = await this.userRepository.findOne({
      where: {
        id,
      },
      select: EntityFactory.getSelectFieldsAsObj(_.uniq(f.concat('status'))),
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
}
