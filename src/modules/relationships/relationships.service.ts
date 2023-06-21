import { BadRequestException, Injectable } from '@nestjs/common';
import { LessThan } from 'typeorm';

import { EntityFactory } from '../../commons/lib/entity-factory';
import { User } from '../users/entities/user.entity';
import { UserEntity } from '../users/users-entity.service';
import { CancelLikeRelationshipDto } from './dto/cancel-like-relationship.dto';
import { SendLikeRelationshipDto } from './dto/create-relationship.dto';
import { FindMatchedRelationshipsDto } from './dto/find-matches-relationships.dto';
import { UpdateRelationshipDto } from './dto/update-relationship.dto';
import { Relationship } from './entities/relationship.entity';
import { RelationshipEntity } from './relationship-entity.service';
import { ORelationshipUserStatus } from './relationships.constant';

@Injectable()
export class RelationshipsService {
  constructor(
    private readonly relationshipEntity: RelationshipEntity,
    private readonly userEntity: UserEntity,
  ) {}

  public async sendLike(
    payload: SendLikeRelationshipDto,
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
    if (existRelationship) {
      const {
        userOneStatus,
        userTwoStatus,
        id: existRelationshipId,
      } = existRelationship;
      const updateRelationshipEntity: Partial<Relationship> = {};
      if (!existRelationshipId) {
        throw new BadRequestException();
      }
      if (this.userEntity.isUserOneByIds(currentUserId, userIds)) {
        if (userOneStatus === ORelationshipUserStatus.like) {
          throw new BadRequestException();
        }
        updateRelationshipEntity.userOneStatus = ORelationshipUserStatus.like;
      } else {
        if (userTwoStatus === ORelationshipUserStatus.like) {
          throw new BadRequestException();
        }
        updateRelationshipEntity.userTwoStatus = ORelationshipUserStatus.like;
      }
      await this.relationshipEntity.updateOne(
        existRelationshipId,
        updateRelationshipEntity,
        currentUserId,
      );
      return { ...existRelationship, ...updateRelationshipEntity };
    }
    return await this.relationshipEntity.saveOne(
      {
        userOne,
        userTwo,
      },
      currentUserId,
    );
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
      ? { userOneStatus: ORelationshipUserStatus.cancel }
      : { userTwoStatus: ORelationshipUserStatus.cancel };
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
    const { f, cursor } = queryParams;
    const currentUser = new User({ id: currentUserId });
    const findResult = await this.relationshipEntity.findMany({
      where: [
        {
          ...(cursor ? { id: LessThan(cursor) } : {}),
          userOneStatus: ORelationshipUserStatus.like,
          userTwoStatus: ORelationshipUserStatus.like,
          userOne: currentUser,
        },
        {
          ...(cursor ? { id: LessThan(cursor) } : {}),
          userOneStatus: ORelationshipUserStatus.like,
          userTwoStatus: ORelationshipUserStatus.unlike,
          userTwo: currentUser,
        },
      ],
      select: f,
      order: {
        id: 'DESC',
      },
    });

    return {
      data: findResult,
      pagination: {
        cursor: EntityFactory.getCursor(findResult),
      },
    };
  }

  findAll() {
    //   ...(cursor ? { id: MoreThan(cursor) } : {}),
    return `This action returns all relationships`;
  }

  findOne(id: number) {
    return `This action returns a #${id} relationship`;
  }

  update(id: number, updateRelationshipDto: UpdateRelationshipDto) {
    return `This action updates a #${id} relationship`;
  }
}
