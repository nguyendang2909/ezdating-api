import { BadRequestException, Injectable } from '@nestjs/common';
import moment from 'moment';
import { IsNull, LessThan, Not } from 'typeorm';

import { EntityFactory } from '../../commons/lib/entity-factory';
import { User } from '../users/entities/user.entity';
import { UserEntity } from '../users/users-entity.service';
import { CancelLikeRelationshipDto } from './dto/cancel-like-relationship.dto';
import { SendRelationshipStatusDto } from './dto/create-relationship.dto';
import { FindManyRoomsDto } from './dto/find-many-rooms.dto';
import { FindMatchedRelationshipsDto } from './dto/find-matches-relationships.dto';
import { Relationship } from './entities/relationship.entity';
import { RelationshipEntity } from './relationship-entity.service';
import { RelationshipUserStatusObj } from './relationships.constant';

@Injectable()
export class RelationshipsService {
  constructor(
    private readonly relationshipEntity: RelationshipEntity,
    private readonly userEntity: UserEntity,
  ) {}

  public async sendStatus(payload: SendRelationshipStatusDto, userId: string) {
    const { targetUserId, status } = payload;
    if (userId === targetUserId) {
      throw new BadRequestException({
        errorCode: 'CONFLICT_USER',
        message: 'You cannot send status yourself!',
      });
    }
    await this.userEntity.findOneOrFailById(targetUserId, {
      select: { id: true, status: true },
    });
    const userIds = [targetUserId, userId].sort();
    const userOne = new User({ id: userIds[0] });
    const userTwo = new User({ id: userIds[1] });
    const isUserOne = this.userEntity.isUserOneByIds(userId, userIds);
    const existRelationship = await this.relationshipEntity.findOne({
      where: {
        userOne,
        userTwo,
      },
      select: {
        id: true,
        userOne: {
          id: true,
        },
        userTwo: {
          id: true,
        },
        userOneStatus: true,
        userTwoStatus: true,
      },
    });
    if (!existRelationship) {
      return await this.relationshipEntity.saveOne(
        {
          userOne,
          userTwo,
          ...(isUserOne
            ? { userOneStatus: status }
            : { userTwoStatus: status }),
        },
        userId,
      );
    }
    const {
      userOneStatus,
      userTwoStatus,
      id: relationshipId,
    } = existRelationship;
    if (status === (isUserOne ? userOneStatus : userTwoStatus)) {
      throw new BadRequestException({
        errorCode: 'CONFLICT_RELATIONSHIP_STATUS',
        message: 'You already sent this status!',
      });
    }
    const updateRelationshipEntity: Partial<Relationship> = {};
    if (status === RelationshipUserStatusObj.like) {
      updateRelationshipEntity.statusAt = moment().toDate();
    }
    if (isUserOne) {
      if (userOneStatus === status) {
      }
      updateRelationshipEntity.userOneStatus = status;
      if (status === RelationshipUserStatusObj.like) {
        updateRelationshipEntity.statusAt = moment().toDate();
      }
    } else {
      if (userTwoStatus === RelationshipUserStatusObj.like) {
        throw new BadRequestException();
      }
      updateRelationshipEntity.userTwoStatus = RelationshipUserStatusObj.like;
    }
    await this.relationshipEntity.updateOne(
      relationshipId,
      updateRelationshipEntity,
      userId,
    );
    return { ...existRelationship, ...updateRelationshipEntity };
  }

  public async cancelLike(
    payload: CancelLikeRelationshipDto,
    currentUserId: string,
  ) {
    const { targetUserId } = payload;
    if (currentUserId === targetUserId) {
      throw new BadRequestException({ errorCode: 'CONFLICT_USER' });
    }
    const existTargetUser = await this.userEntity.findOneByIdAndValidate(
      targetUserId,
      {
        select: { id: true, status: true },
      },
    );
    if (!existTargetUser) {
      throw new BadRequestException();
    }
    const userIds = [targetUserId, currentUserId].sort();
    const userOne = new User({ id: userIds[0] });
    const userTwo = new User({ id: userIds[1] });
    const existRelationship = await this.relationshipEntity.findOne({
      where: {
        userOne,
        userTwo,
      },
      select: {
        userOne: {
          id: true,
        },
        userTwo: {
          id: true,
        },
        userOneStatus: true,
        userTwoStatus: true,
      },
    });
    if (!existRelationship) {
      throw new BadRequestException({
        errorCode: 'RELATIONSHIP_DOES_NOT_EXIST',
      });
    }
    const { id: existRelationshipId } = existRelationship;
    if (!existRelationshipId) {
      throw new BadRequestException();
    }
    const updateOptions = this.userEntity.isUserOneByIds(currentUserId, userIds)
      ? { userOneStatus: RelationshipUserStatusObj.cancel }
      : { userTwoStatus: RelationshipUserStatusObj.cancel };
    await this.relationshipEntity.updateOne(
      existRelationshipId,
      updateOptions,
      currentUserId,
    );
    return { success: true };
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
          userOneStatus: RelationshipUserStatusObj.like,
          userTwoStatus: RelationshipUserStatusObj.like,
          userOne: currentUser,
        },
        {
          ...(lastStatusAt ? { createdAt: LessThan(lastStatusAt) } : {}),
          userOneStatus: RelationshipUserStatusObj.like,
          userTwoStatus: RelationshipUserStatusObj.like,
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
          userOneStatus: RelationshipUserStatusObj.like,
          userTwoStatus: RelationshipUserStatusObj.like,
        },
        {
          ...(lastMessageAt
            ? { createdAt: LessThan(lastMessageAt) }
            : { lastMessage: Not(IsNull()) }),
          userTwo: currentUser,
          userOneStatus: RelationshipUserStatusObj.like,
          userTwoStatus: RelationshipUserStatusObj.like,
        },
        {
          ...(lastMessageAt
            ? { createdAt: LessThan(lastMessageAt) }
            : { lastMessage: Not(IsNull()) }),
          userOne: currentUser,
          canUserOneChat: true,
        },
        {
          ...(lastMessageAt
            ? { createdAt: LessThan(lastMessageAt) }
            : { lastMessage: Not(IsNull()) }),
          userOne: currentUser,
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
}
