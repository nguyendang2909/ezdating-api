import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { MoreThan, Repository } from 'typeorm';

import { EntityFactory } from '../../commons/lib/entity-factory';
import { FindManyRoomsDto } from './dto/find-many-room.dto';
import { FindOneRoomByIdDto } from './dto/find-one-room-by-id.dto';
import { CreateRoomDto } from './dto/join-room.dto';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
  ) {}

  public async create(createRoomDto: CreateRoomDto, currentUserId: string) {
    const { userIds } = createRoomDto;
    const uniqueUserIds = _.union(userIds, currentUserId).sort();
    const createResult = await this.roomRepository.save({
      userIds: uniqueUserIds,
      createdBy: currentUserId,
      updatedBy: currentUserId,
    });

    return createResult;
  }

  public async findMany(
    findManyRoomsDto: FindManyRoomsDto,
    currentUserId: string,
  ) {
    const { cursor, f } = findManyRoomsDto;
    const findResult = await this.roomRepository.find({
      where: {
        userIds: currentUserId,
        ...(cursor ? { id: MoreThan(cursor) } : {}),
      },
      take: 20,
      select: f,
    });

    return {
      data: findResult,
      pagination: {
        cursor: EntityFactory.getCursor(findResult),
      },
    };
  }

  public async findOneById(
    id: string,
    findOneRoomByIdDto: FindOneRoomByIdDto,
    currentUserId: string,
  ) {
    const { f } = findOneRoomByIdDto;
    const findResult = await this.roomRepository.findOne({
      where: {
        id,
        userIds: currentUserId,
      },
      select: f,
    });

    return findResult;
  }

  public async findOneOrFailById(
    id: string,
    findOneRoomByIdDto: FindOneRoomByIdDto,
    currentUserId: string,
  ) {
    const findResult = await this.findOneById(
      id,
      findOneRoomByIdDto,
      currentUserId,
    );
    if (!findResult) {
      throw new BadRequestException('Room not found!');
    }

    return findResult;
  }

  // update(id: number, updateRoomDto: UpdateRoomDto) {}
}
