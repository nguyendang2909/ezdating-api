import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { Repository } from 'typeorm';

import { EntityFindOneByIdOptions } from '../../commons/types/find-options.type';
import { Relationship } from '../relationships/entities/relationship.entity';
import { CreateRoomDto } from './dto/join-room.dto';
import { Room } from './entities/room.entity';

export class RoomEntity {
  constructor(
    @InjectRepository(Room) private readonly repository: Repository<Room>,
  ) {}

  public async create(createRoomDto: CreateRoomDto, currentUserId: string) {
    const { userIds } = createRoomDto;
    const uniqueUserIds = _.union(userIds, currentUserId).sort();
    const createResult = await this.repository.save({
      userIds: uniqueUserIds,
    });

    return createResult;
  }

  public async findOneById(
    id: string,
    options: EntityFindOneByIdOptions<Relationship>,
  ) {
    return await this.repository.findOne({
      ...options,
      where: { id },
    });
  }
}
