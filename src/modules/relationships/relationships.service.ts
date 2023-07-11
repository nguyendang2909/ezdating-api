import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import moment from 'moment';
import { IsNull, LessThan, MoreThan, Not } from 'typeorm';

import { Cursors } from '../../commons/constants/paginations';
import { EntityFactory } from '../../commons/lib/entity-factory';
import { MessageEntity } from '../messages/message-entity.service';
import { User } from '../users/entities/user.entity';
import { UserEntity } from '../users/users-entity.service';
import { SendRelationshipStatusDto } from './dto/create-relationship.dto';
import { FindMatchedRelationshipsDto } from './dto/find-matches-relationships.dto';
import { Relationship } from './entities/relationship.entity';
import { RelationshipEntity } from './relationship-entity.service';
import { RelationshipUserStatuses } from './relationships.constant';

@Injectable()
export class RelationshipsService {
  constructor(
    private readonly relationshipEntity: RelationshipEntity,
    private readonly userEntity: UserEntity,
    private readonly messageEntity: MessageEntity,
  ) {}

  public async sendStatus(payload: SendRelationshipStatusDto, userId: string) {
    const { targetUserId, status } = payload;
    this.userEntity.validateYourSelf(userId, targetUserId);
    await this.userEntity.findOneAndValidateBasicInfoById(targetUserId);
    const userIds = [userId, targetUserId].sort();
    const relationshipId = userIds.join('_');
    const userOne = new User({ id: userIds[0] });
    const userTwo = new User({ id: userIds[1] });
    const isUserOne = this.userEntity.isUserOneByIds(userId, userIds);
    const existRelationship = await this.relationshipEntity.findOne({
      where: {
        id: relationshipId,
      },
    });
    const now = moment().toDate();
    if (!existRelationship) {
      return await this.relationshipEntity.saveOne(
        {
          id: relationshipId,
          userOne,
          userTwo,
          statusAt: now,
          ...(isUserOne
            ? { userOneStatus: status }
            : { userTwoStatus: status }),
        },
        userId,
      );
    }
    this.relationshipEntity.validateBlocked(existRelationship, isUserOne);
    this.relationshipEntity.validateConflictSendStatus(
      status,
      existRelationship,
      isUserOne,
    );
    const updateRelationshipEntity: Partial<Relationship> = {
      statusAt: now,
      ...(isUserOne
        ? {
            userOneStatus: status,
            userOneStatusAt: now,
          }
        : {
            userTwoStatus: status,
            userTwoStatusAt: now,
          }),
    };
    await this.relationshipEntity.updateOneById(
      existRelationship.id,
      updateRelationshipEntity,
      userId,
    );
    return { ...existRelationship, ...updateRelationshipEntity };
  }

  public async findMatched(
    queryParams: FindMatchedRelationshipsDto,
    currentUserId: string,
  ) {
    const { cursor } = queryParams;
    const extractCursor = EntityFactory.extractCursor(cursor);
    const lastStatusAt = extractCursor
      ? new Date(extractCursor.value)
      : undefined;
    const lastStatusAtQuery = lastStatusAt
      ? {
          statusAt:
            extractCursor?.type === Cursors.after
              ? LessThan(lastStatusAt)
              : MoreThan(lastStatusAt),
        }
      : {};
    const findResult = await this.relationshipEntity.findMany({
      where: [
        {
          ...lastStatusAtQuery,
          userOneStatus: RelationshipUserStatuses.like,
          userTwoStatus: RelationshipUserStatuses.like,
          userOne: {
            id: currentUserId,
          },
          lastMessage: IsNull(),
        },
        {
          ...lastStatusAtQuery,
          userOneStatus: RelationshipUserStatuses.like,
          userTwoStatus: RelationshipUserStatuses.like,
          userTwo: {
            id: currentUserId,
          },
          lastMessage: IsNull(),
        },
      ],
      order: {
        statusAt: 'DESC',
      },
      relations: ['userOne', 'userTwo'],
      take: 20,
      select: {
        userOne: {
          id: true,
          nickname: true,
        },
        userTwo: {
          id: true,
          nickname: true,
        },
      },
    });

    return {
      data: findResult,
      pagination: {
        cursor: EntityFactory.getCursors(_.last(findResult)?.statusAt),
      },
    };
  }

  public async findUsersLikeMe(
    queryParams: FindMatchedRelationshipsDto,
    currentUserId: string,
  ) {
    const { cursor } = queryParams;
    const extractCursor = EntityFactory.extractCursor(cursor);
    const lastStatusAt = extractCursor
      ? new Date(extractCursor.value)
      : undefined;
    const findResult = await this.relationshipEntity.findMany({
      where: [
        {
          ...(lastStatusAt
            ? {
                userTwoStatus:
                  extractCursor?.type === Cursors.after
                    ? LessThan(lastStatusAt)
                    : MoreThan(lastStatusAt),
              }
            : {}),
          userOneStatus: Not(RelationshipUserStatuses.like),
          userTwoStatus: RelationshipUserStatuses.like,
          userOne: {
            id: currentUserId,
          },
        },
        {
          ...(lastStatusAt
            ? {
                userOneStatusAt:
                  extractCursor?.type === Cursors.after
                    ? LessThan(lastStatusAt)
                    : MoreThan(lastStatusAt),
              }
            : {}),
          userOneStatus: RelationshipUserStatuses.like,
          userTwoStatus: Not(RelationshipUserStatuses.like),
          userTwo: {
            id: currentUserId,
          },
        },
      ],
      order: {
        statusAt: 'DESC',
      },
      take: 20,
    });

    return {
      data: findResult,
      pagination: {
        cursor: EntityFactory.getCursors(_.last(findResult)?.statusAt),
      },
    };
  }
}
