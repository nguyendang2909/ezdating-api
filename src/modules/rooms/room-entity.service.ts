import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { ArrayContains, Repository } from 'typeorm';

import {
  EntityFindManyOptions,
  EntityFindOneByIdOptions,
  EntityFindOneOptions,
} from '../../commons/types/find-options.type';
import { Relationship } from '../relationships/entities/relationship.entity';
import { Room } from './entities/room.entity';

export class RoomEntity {
  constructor(
    @InjectRepository(Room) private readonly repository: Repository<Room>,
  ) {}

  public async create(entity: Partial<Room>, currentUserId: string) {
    const { userIds } = entity;
    const uniqueUserIds = _.union(userIds, currentUserId).sort();
    const createResult = await this.repository.save({
      userIds: uniqueUserIds,
    });
    return createResult;
  }

  public async findMany(options: EntityFindManyOptions<Relationship>) {
    return await this.repository.find({ ...options, take: 20 });
  }

  public async findOne(
    options: EntityFindOneOptions<Room>,
  ): Promise<Partial<Room> | null> {
    if (_.isEmpty(options.where)) {
      return null;
    }
    return await this.repository.findOne(options);
  }

  public async findOneById(
    id: string,
    options: EntityFindOneByIdOptions<Room>,
  ) {
    return await this.repository.findOne({
      ...options,
      where: { id },
    });
  }

  public async findOneByIdAndUserId(
    roomId: string,
    userId: string,
    options: EntityFindOneByIdOptions<Room>,
  ) {
    return await this.repository.findOne({
      ...options,
      where: { id: roomId, userIds: ArrayContains([userId]) },
    });
  }
}
