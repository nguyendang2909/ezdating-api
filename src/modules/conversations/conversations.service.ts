import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { IsNull, LessThan, MoreThan, Not } from 'typeorm';

import { Cursors } from '../../commons/constants/paginations';
import { EntityFactory } from '../../commons/lib/entity-factory';
import { FindManyMessagesByConversationIdDto } from '../messages/dto/find-many-messages.dto';
import { MessageEntity } from '../messages/message-entity.service';
import { RelationshipEntity } from '../relationships/relationship-entity.service';
import { RelationshipUserStatuses } from '../relationships/relationships.constant';
import { User } from '../users/entities/user.entity';
import { UserEntity } from '../users/users-entity.service';
import { FindManyConversations } from './dto/find-many-conversations.dto';

@Injectable()
export class ConversationsService {
  constructor(
    private readonly relationshipEntity: RelationshipEntity,
    private readonly userEntity: UserEntity,
    private readonly messageEntity: MessageEntity,
  ) {}
  public async findMany(queryParams: FindManyConversations, userId: string) {
    const { cursor } = queryParams;
    const currentUser = new User({ id: userId });
    const extractCursor = EntityFactory.extractCursor(cursor);
    const lastMessageAt = extractCursor
      ? new Date(extractCursor.value)
      : undefined;
    const lastMessageAtQuery = lastMessageAt
      ? {
          createdAt:
            extractCursor?.type === Cursors.before
              ? MoreThan(lastMessageAt)
              : LessThan(lastMessageAt),
        }
      : { lastMessage: Not(IsNull()) };
    const findResult = await this.relationshipEntity.findMany({
      where: [
        {
          ...lastMessageAtQuery,
          userOne: currentUser,
          userOneStatus: RelationshipUserStatuses.like,
          userTwoStatus: RelationshipUserStatuses.like,
        },
        {
          ...lastMessageAtQuery,
          userTwo: currentUser,
          userOneStatus: RelationshipUserStatuses.like,
          userTwoStatus: RelationshipUserStatuses.like,
        },
        {
          ...lastMessageAtQuery,
          userOne: currentUser,
          userTwoStatus: Not(RelationshipUserStatuses.block),
          canUserOneChat: true,
        },
        {
          ...lastMessageAtQuery,
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
      const sortedUserIds = this.relationshipEntity.getSortedUserIdsFromId(
        item.id,
      );
      const isUserOne = this.userEntity.isUserOneByIds(userId, sortedUserIds);

      return {
        ...partItem,
        targetUser: isUserOne
          ? this.userEntity.convertInRelationship(userOne)
          : this.userEntity.convertInRelationship(userTwo),
      };
    });

    return {
      type: 'conversations',
      data: formatFindResult,
      pagination: {
        cursors: EntityFactory.getCursors(
          _.last(formatFindResult)?.lastMessageAt,
        ),
      },
    };
  }

  public async findManyMessagesByConversationId(
    id: string,
    queryParams: FindManyMessagesByConversationIdDto,
    user: User,
  ) {
    await this.relationshipEntity.findOneConversationOrFailById(id, user.id);
    const { cursor } = queryParams;
    const extractCursor = EntityFactory.extractCursor(cursor);
    const lastCreatedAt = extractCursor
      ? new Date(extractCursor.value)
      : undefined;
    const findResult = await this.messageEntity.findMany({
      where: {
        relationship: { id },
        ...(lastCreatedAt
          ? {
              createdAt:
                extractCursor?.type === Cursors.after
                  ? LessThan(lastCreatedAt)
                  : MoreThan(lastCreatedAt),
            }
          : {}),
      },
      order: {
        createdAt: 'DESC',
      },
      take: 20,
    });

    return {
      type: 'messagesByConversation',
      conversationId: id,
      data: findResult,
      pagination: {
        cursors: EntityFactory.getCursors(_.last(findResult)?.createdAt),
      },
    };
  }
}
