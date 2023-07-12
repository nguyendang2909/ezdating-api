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

  public async findMany(queryParams: FindManyConversations, currentUser: User) {
    const findResult = await this.findManyByQuery(queryParams, currentUser);
    const userIds = this.relationshipEntity.getUserIdsFromId(currentUser.id);
    const isUserOne = this.userEntity.isUserOneByIds(currentUser.id, userIds);
    const conversations = this.relationshipEntity.formatConversations(
      findResult,
      isUserOne,
    );

    return {
      type: 'conversations',
      data: conversations,
      pagination: {
        cursors: EntityFactory.getCursors(_.last(conversations)?.lastMessageAt),
      },
    };
  }

  public async findOneOrFailById(id: string, currentUser: User) {
    const currentUserObj = {
      id: currentUser.id,
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
        'userOne.avatarFile',
        'userTwo',
        'userTwo.avatarFile',
      ],
      select: {
        userOne: {
          id: true,
          birthday: true,
          gender: true,
          introduce: true,
          lastActivatedAt: true,
          lookingFor: true,
          nickname: true,
          role: true,
          status: true,
          avatarFile: {
            location: true,
          },
        },
        userTwo: {
          id: true,
          birthday: true,
          gender: true,
          introduce: true,
          lastActivatedAt: true,
          lookingFor: true,
          nickname: true,
          role: true,
          status: true,
          avatarFile: {
            location: true,
          },
        },
      },
    });

    if (!findResult) {
      throw new NotFoundException({
        errorCode: HttpErrorCodes.CONVERSATION_DOES_NOT_EXIST,
        message: 'Conversation does not exist!',
      });
    }

    const userIds = this.relationshipEntity.getUserIdsFromId(currentUser.id);

    const isUserOne = this.userEntity.isUserOneByIds(currentUser.id, userIds);

    const conversation = this.relationshipEntity.formatConversation(
      findResult,
      isUserOne,
    );

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
      relations: ['user', 'user.avatarFile'],
      select: {
        user: {
          id: true,
          nickname: true,
          avatarFile: {
            location: true,
          },
        },
      },
      take: 20,
    });

    const messages = this.messageEntity.formats(findResult);

    return {
      type: 'messagesByConversation',
      conversationId: id,
      data: messages,
      pagination: {
        cursors: EntityFactory.getCursors(_.last(findResult)?.createdAt),
      },
    };
  }

  public async findManyByQuery(
    queryParams: FindManyConversations,
    currentUser: User,
  ) {
    const { cursor } = queryParams;

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
    return await this.relationshipEntity.findMany({
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
          userOne: {
            id: currentUser.id,
          },
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
          userTwo: {
            id: currentUser.id,
          },
        },
      ],
      order: {
        lastMessageAt: 'DESC',
      },
      relations: [
        'userOne',
        'userOne.uploadFiles',
        'userOne.avatarFile',
        'userTwo',
        'userTwo.uploadFiles',
        'userTwo.avatarFile',
      ],
      select: {
        userOne: {
          id: true,
          birthday: true,
          gender: true,
          introduce: true,
          lastActivatedAt: true,
          lookingFor: true,
          nickname: true,
          role: true,
          status: true,
          avatarFile: {
            location: true,
          },
          uploadFiles: {
            location: true,
          },
        },
        userTwo: {
          id: true,
          birthday: true,
          gender: true,
          introduce: true,
          lastActivatedAt: true,
          lookingFor: true,
          nickname: true,
          role: true,
          status: true,
          avatarFile: {
            location: true,
          },
          uploadFiles: {
            location: true,
          },
        },
      },
    });
  }
}
