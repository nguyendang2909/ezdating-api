import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import moment from 'moment';
import { IsNull, LessThan, MoreThan, Not } from 'typeorm';

import { RelationshipUserStatuses } from '../../commons/constants/constants';
import { Cursors } from '../../commons/constants/paginations';
import { EntityFactory } from '../../commons/lib/entity-factory';
import { Relationship } from '../entities/entities/relationship.entity';
import { User } from '../entities/entities/user.entity';
import { MessageModel } from '../entities/message.model';
import { RelationshipModel } from '../entities/relationship-entity.model';
import { UserModel } from '../entities/user.model';
import { SendRelationshipStatusDto } from './dto/create-relationship.dto';
import { FindMatchedRelationshipsDto } from './dto/find-matches-relationships.dto';

@Injectable()
export class RelationshipsService {
  constructor(
    private readonly relationshipModel: RelationshipModel,
    private readonly userModel: UserModel,
    private readonly messageModel: MessageModel,
  ) {}

  public async sendStatus(payload: SendRelationshipStatusDto, userId: string) {
    const { targetUserId, status } = payload;
    this.userModel.validateYourSelf(userId, targetUserId);
    await this.userModel.findOneAndValidateBasicInfoById(targetUserId);
    const userIds = [userId, targetUserId].sort();
    const relationshipId = userIds.join('_');
    const userOne = new User({ id: userIds[0] });
    const userTwo = new User({ id: userIds[1] });
    const isUserOne = this.userModel.isUserOneByIds(userId, userIds);
    const existRelationship = await this.relationshipModel.findOne({
      where: {
        id: relationshipId,
      },
    });
    const now = moment().toDate();
    if (!existRelationship) {
      return await this.relationshipModel.saveOne(
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
    this.relationshipModel.validateBlocked(existRelationship, isUserOne);
    this.relationshipModel.validateConflictSendStatus(
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
    await this.relationshipModel.updateOneById(
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
    const findResult = await this.relationshipModel.findMany({
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
        cursor: EntityFactory.getCursors({
          before: _.last(findResult)?.statusAt,
          after: _.first(findResult)?.statusAt,
        }),
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
    const findResult = await this.relationshipModel.findMany({
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
        cursor: EntityFactory.getCursors({
          before: _.last(findResult)?.statusAt,
          after: _.first(findResult)?.statusAt,
        }),
      },
    };
  }
}
