import { BadRequestException, Injectable } from '@nestjs/common';
import { ArrayContains } from 'typeorm';

import { JoinRoomDto } from './dto/join-room.dto';
import { RoomEntity } from './room-entity.service';

@Injectable()
export class RoomsService {
  constructor(
    // @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
    private readonly roomEntity: RoomEntity,
  ) {}

  public async joinRoom(payload: JoinRoomDto, userId: string) {
    const { roomId, targetUserId } = payload;
    if (roomId) {
      const findResult = await this.roomEntity.findOne({
        where: { id: roomId, userIds: ArrayContains([userId]) },
        select: {
          id: true,
          latMessage: true,
          lastMessageAt: true,
          name: true,
          userIds: true,
        },
      });
      if (!findResult) {
        throw new BadRequestException({ errorCode: 'ROOM_DOES_NOT_EXIST' });
      }
      return findResult;
    }
    // const existRoom = await this.roomEntity.findOne({
    //   where: {
    //     userIds: ['a', 'b'],
    //   },
    // });
    // return await this.sendMessageByTargetUserId(targetUserId, userId);
  }

  // public async create(createRoomDto: CreateRoomDto, currentUserId: string) {
  //   const { userIds } = createRoomDto;
  //   const uniqueUserIds = _.union(userIds, currentUserId).sort();
  //   const createResult = await this.roomRepository.save({
  //     userIds: uniqueUserIds,
  //     createdBy: currentUserId,
  //     updatedBy: currentUserId,
  //   });

  //   return createResult;
  // }

  // public async findMany(
  //   findManyRoomsDto: FindManyRoomsDto,
  //   currentUserId: string,
  // ) {
  //   const { cursor, f } = findManyRoomsDto;
  //   const findResult = await this.roomEntity.find({
  //     where: {
  //       userIds: currentUserId,
  //       ...(cursor ? { id: MoreThan(cursor) } : {}),
  //     },
  //     take: 20,
  //     select: f,
  //   });

  //   return {
  //     data: findResult,
  //     pagination: {
  //       cursor: EntityFactory.getCursor(findResult),
  //     },
  //   };
  // }

  // public async findOneById(
  //   id: string,
  //   findOneRoomByIdDto: FindOneRoomByIdDto,
  //   currentUserId: string,
  // ) {
  //   const { f } = findOneRoomByIdDto;
  //   const findResult = await this.roomRepository.findOne({
  //     where: {
  //       id,
  //       userIds: currentUserId,
  //     },
  //     select: f,
  //   });

  //   return findResult;
  // }

  // public async findOneOrFailById(
  //   id: string,
  //   findOneRoomByIdDto: FindOneRoomByIdDto,
  //   currentUserId: string,
  // ) {
  //   const findResult = await this.findOneById(
  //     id,
  //     findOneRoomByIdDto,
  //     currentUserId,
  //   );
  //   if (!findResult) {
  //     throw new BadRequestException('Room not found!');
  //   }

  //   return findResult;
  // }

  // update(id: number, updateRoomDto: UpdateRoomDto) {}
}
