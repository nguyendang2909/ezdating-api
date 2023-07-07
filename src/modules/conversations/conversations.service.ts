import { Injectable } from '@nestjs/common';
import { IsNull, LessThan, Not } from 'typeorm';

import { EntityFactory } from '../../commons/lib/entity-factory';
import { FindManyMessagesByRoomIdDto } from '../messages/dto/find-many-messages.dto';
import { MessageEntity } from '../messages/message-entity.service';
import { RelationshipEntity } from '../relationships/relationship-entity.service';
import { RelationshipUserStatuses } from '../relationships/relationships.constant';
import { User } from '../users/entities/user.entity';
import { UserEntity } from '../users/users-entity.service';
import { FindManyConversations } from './dto/find-many-rooms.dto';

@Injectable()
export class ConversationsService {
  constructor(
    private readonly relationshipEntity: RelationshipEntity,
    private readonly userEntity: UserEntity,
    private readonly messageEntity: MessageEntity,
  ) {}
  public async findManyRooms(
    queryParams: FindManyConversations,
    userId: string,
  ) {
    const { cursor } = queryParams;
    const currentUser = new User({ id: userId });
    const lastMessageAt = cursor
      ? new Date(EntityFactory.decodeCursor(cursor))
      : undefined;
    const findResult = await this.relationshipEntity.findMany({
      where: [
        {
          ...(lastMessageAt
            ? { createdAt: LessThan(lastMessageAt) }
            : { lastMessage: Not(IsNull()) }),
          userOne: currentUser,
          userOneStatus: RelationshipUserStatuses.like,
          userTwoStatus: RelationshipUserStatuses.like,
        },
        {
          ...(lastMessageAt
            ? { createdAt: LessThan(lastMessageAt) }
            : { lastMessage: Not(IsNull()) }),
          userTwo: currentUser,
          userOneStatus: RelationshipUserStatuses.like,
          userTwoStatus: RelationshipUserStatuses.like,
        },
        {
          ...(lastMessageAt
            ? { createdAt: LessThan(lastMessageAt) }
            : { lastMessage: Not(IsNull()) }),
          userOne: currentUser,
          userTwoStatus: Not(RelationshipUserStatuses.block),
          canUserOneChat: true,
        },
        {
          ...(lastMessageAt
            ? { createdAt: LessThan(lastMessageAt) }
            : { lastMessage: Not(IsNull()) }),
          userTwo: currentUser,
          userOneStatus: Not(RelationshipUserStatuses.block),
          canUserTwoChat: true,
        },
      ],
      order: {
        lastMessageAt: 'DESC',
      },
      relations: [
        'userOne',
        'userOne.uploadFiles',
        'userTwo',
        'userTwo.uploadFiles',
      ],
      take: 20,
    });

    const formatFindResult = findResult.map((item) => {
      const { userOne, userTwo, ...partItem } = item;
      return {
        ...partItem,
        ...(userOne
          ? {
              userOne: this.userEntity.convertInRelationship(userOne),
            }
          : {}),
        ...(userTwo
          ? {
              userTwo: this.userEntity.convertInRelationship(userTwo),
            }
          : {}),
      };
    });

    return {
      data: formatFindResult,
      pagination: {
        cursor: EntityFactory.getCursor(findResult, 'lastMessageAt'),
      },
    };
  }

  public async findManyMessagesByRoomId(
    id: string,
    queryParams: FindManyMessagesByRoomIdDto,
    user: User,
  ) {
    await this.relationshipEntity.findOneRoomOrFailById(id, user.id);
    const { cursor } = queryParams;
    const lastCreatedAt = cursor
      ? new Date(EntityFactory.decodeCursor(cursor))
      : undefined;
    const findResult = await this.messageEntity.findMany({
      where: {
        relationship: { id },
        ...(lastCreatedAt
          ? {
              createdAt: LessThan(lastCreatedAt),
            }
          : {}),
      },
      order: {
        createdAt: 'DESC',
      },
      take: 20,
    });

    return {
      data: findResult,
      pagination: {
        cursor: EntityFactory.getCursor(findResult, 'createdAt'),
      },
    };
  }
}
