import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { Repository } from 'typeorm';

import { CreateRoomDto } from './dto/join-room.dto';
import { Room } from './entities/room.entity';

export class RoomsUtil {
  constructor(
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
  ) {}

  public async create(createRoomDto: CreateRoomDto, currentUserId: string) {
    const { userIds } = createRoomDto;
    const uniqueUserIds = _.union(userIds, currentUserId).sort();
    const createResult = await this.roomRepository.save({
      userIds: uniqueUserIds,
    });

    return createResult;
  }
}
