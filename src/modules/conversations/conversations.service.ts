import { Injectable, NotFoundException } from '@nestjs/common';
import _ from 'lodash';
import { And, IsNull, LessThan, MoreThan, Not } from 'typeorm';

import { Cursors } from '../../commons/constants/paginations';
import { HttpErrorCodes } from '../../commons/erros/http-error-codes.constant';
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
          lastMessageAt:
            extractCursor?.type === Cursors.before
              ? MoreThan(lastMessageAt)
              : LessThan(lastMessageAt),
        }
      : { lastMessageAt: Not(IsNull()) };
    const findResult = await this.relationshipEntity.findMany({
      where: [
        {
          ...lastMessageAtQuery,
          userOneStatus: And(
            Not(RelationshipUserStatuses.block),
            Not(RelationshipUserStatuses.cancel),
          ),
          userTwoStatus: And(
            Not(RelationshipUserStatuses.block),
            Not(RelationshipUserStatuses.cancel),
          ),
          userOne: currentUser,
        },
        {
          ...lastMessageAtQuery,
          userOneStatus: And(
            Not(RelationshipUserStatuses.block),
            Not(RelationshipUserStatuses.cancel),
          ),
          userTwoStatus: And(
            Not(RelationshipUserStatuses.block),
            Not(RelationshipUserStatuses.cancel),
          ),
          userTwo: currentUser,
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
      const userIds = this.relationshipEntity.getUserIdsFromId(item.id);
      const isUserOne = this.userEntity.isUserOneByIds(userId, userIds);

      return {
        ...partItem,
        targetUser: isUserOne
          ? this.userEntity.convertInRelationship(userTwo)
          : this.userEntity.convertInRelationship(userOne),
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

  public async findOneOrFailById(id: string, user: User) {
    const currentUserObj = {
      id: user.id,
    };
    const lastMessageQuery = { lastMessage: Not(IsNull()) };
    const findResult = await this.relationshipEntity.findOne({
      where: [
        {
          ...lastMessageQuery,
          userOneStatus: And(
            Not(RelationshipUserStatuses.block),
            Not(RelationshipUserStatuses.cancel),
          ),
          userTwoStatus: And(
            Not(RelationshipUserStatuses.block),
            Not(RelationshipUserStatuses.cancel),
          ),
          userOne: currentUserObj,
        },
        {
          ...lastMessageQuery,
          userOneStatus: And(
            Not(RelationshipUserStatuses.block),
            Not(RelationshipUserStatuses.cancel),
          ),
          userTwoStatus: And(
            Not(RelationshipUserStatuses.block),
            Not(RelationshipUserStatuses.cancel),
          ),
          userTwo: currentUserObj,
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
    });
    if (!findResult) {
      throw new NotFoundException({
        errorCode: HttpErrorCodes.CONVERSATION_DOES_NOT_EXIST,
        message: 'Conversation does not exist!',
      });
    }

    const { userOne, userTwo, ...partConversation } = findResult;
    const userIds = this.relationshipEntity.getUserIdsFromId(findResult.id);
    const isUserOne = this.userEntity.isUserOneByIds(user.id, userIds);

    const conversation = {
      ...partConversation,
      targetUser: isUserOne
        ? this.userEntity.convertInRelationship(userTwo)
        : this.userEntity.convertInRelationship(userOne),
    };

    return {
      type: 'conversations',
      data: conversation,
    };
  }

  public async findManyMessagesByConversationId(
    id: string,
    queryParams: FindManyMessagesByConversationIdDto,
    user: User,
  ) {
    await this.findOneOrFailById(id, user);
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
      relations: ['user'],
      select: {
        user: {
          id: true,
          nickname: true,
          avatar: true,
        },
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
