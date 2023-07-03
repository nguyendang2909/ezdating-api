import { Injectable, NotFoundException } from '@nestjs/common';
import moment from 'moment';
import { IsNull, LessThan, Not } from 'typeorm';

import { HttpErrorCodes } from '../../commons/erros/http-error-codes.constant';
import { EntityFactory } from '../../commons/lib/entity-factory';
import { User } from '../users/entities/user.entity';
import { UserEntity } from '../users/users-entity.service';
import { SendRelationshipStatusDto } from './dto/create-relationship.dto';
import { FindManyRoomsDto } from './dto/find-many-rooms.dto';
import { FindMatchedRelationshipsDto } from './dto/find-matches-relationships.dto';
import { Relationship } from './entities/relationship.entity';
import { RelationshipEntity } from './relationship-entity.service';
import { RelationshipUserStatuses } from './relationships.constant';

@Injectable()
export class RelationshipsService {
  constructor(
    private readonly relationshipEntity: RelationshipEntity,
    private readonly userEntity: UserEntity,
  ) {}

  public async sendStatus(payload: SendRelationshipStatusDto, userId: string) {
    const { targetUserId, status } = payload;
    this.userEntity.validateYourSelf(userId, targetUserId);
    await this.userEntity.findOneAndValidateBasicInfoById(targetUserId);
    const userIds = [targetUserId, userId].sort();
    const relationshipId = userIds.join('');
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
    const currentUser = new User({ id: currentUserId });
    const lastStatusAt = cursor
      ? new Date(EntityFactory.decodeCursor(cursor))
      : undefined;
    const findResult = await this.relationshipEntity.findMany({
      where: [
        {
          ...(lastStatusAt ? { createdAt: LessThan(lastStatusAt) } : {}),
          userOneStatus: RelationshipUserStatuses.like,
          userTwoStatus: RelationshipUserStatuses.like,
          userOne: currentUser,
        },
        {
          ...(lastStatusAt ? { createdAt: LessThan(lastStatusAt) } : {}),
          userOneStatus: RelationshipUserStatuses.like,
          userTwoStatus: RelationshipUserStatuses.like,
          userTwo: currentUser,
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
        cursor: EntityFactory.getCursor(findResult),
      },
    };
  }

  public async findUsersLikeMe(
    queryParams: FindMatchedRelationshipsDto,
    currentUserId: string,
  ) {
    const { cursor } = queryParams;
    const currentUser = new User({ id: currentUserId });
    const lastStatusAt = cursor
      ? new Date(EntityFactory.decodeCursor(cursor))
      : undefined;
    const findResult = await this.relationshipEntity.findMany({
      where: [
        {
          ...(lastStatusAt ? { createdAt: LessThan(lastStatusAt) } : {}),
          userOneStatus: Not(RelationshipUserStatuses.like),
          userTwoStatus: RelationshipUserStatuses.like,
          userOne: currentUser,
        },
        {
          ...(lastStatusAt ? { createdAt: LessThan(lastStatusAt) } : {}),
          userOneStatus: RelationshipUserStatuses.like,
          userTwoStatus: Not(RelationshipUserStatuses.like),
          userTwo: currentUser,
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
        cursor: EntityFactory.getCursor(findResult),
      },
    };
  }

  public async findManyRooms(queryParams: FindManyRoomsDto, userId: string) {
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
      take: 20,
    });

    return {
      data: findResult,
      pagination: {
        cursor: EntityFactory.getCursor(findResult, 'lastMessageAt'),
      },
    };
  }

  public async findOneRoomById(id: string, userId: string) {
    const findResult = await this.relationshipEntity.findOneRoomById(
      id,
      userId,
    );
    if (!findResult) {
      throw new NotFoundException({
        errorCode: HttpErrorCodes.ROOM_DOES_NOT_EXIST,
        message: 'Room does not exist!',
      });
    }
    return findResult;
  }
}
