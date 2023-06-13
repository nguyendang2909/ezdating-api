import { BadRequestException, Injectable } from '@nestjs/common';

import { User } from '../users/entities/user.entity';
import { UsersUtil } from '../users/users.util';
import { SendLikeRelationshipDto } from './dto/create-relationship.dto';
import { UpdateRelationshipDto } from './dto/update-relationship.dto';
import { Relationship } from './entities/relationship.entity';
import { RelationshipEntity } from './relationship-entity.service';

@Injectable()
export class RelationshipsService {
  constructor(
    private readonly relationshipEntity: RelationshipEntity,
    private readonly userEntity: UsersUtil,
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
        likeOne: true,
        likeTwo: true,
      },
    });
    if (existRelationship) {
      const { likeOne, likeTwo, id: existRelationshipId } = existRelationship;
      const updateRelationshipEntity: Partial<Relationship> = {};
      if (!existRelationshipId) {
        throw new BadRequestException();
      }
      if (currentUserId === userIds[0]) {
        if (likeOne === true) {
          throw new BadRequestException();
        }
        updateRelationshipEntity.likeOne = true;
      } else {
        if (likeTwo === true) {
          throw new BadRequestException();
        }
        updateRelationshipEntity.likeTwo = true;
      }
      await this.relationshipEntity.updateOne(
        existRelationshipId,
        updateRelationshipEntity,
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

  findAll() {
    return `This action returns all relationships`;
  }

  findOne(id: number) {
    return `This action returns a #${id} relationship`;
  }

  update(id: number, updateRelationshipDto: UpdateRelationshipDto) {
    return `This action updates a #${id} relationship`;
  }

  remove(id: number) {
    return `This action removes a #${id} relationship`;
  }

  private isUserOne(userId: string, userIds: string[]): boolean {
    return userId === userIds[0];
  }
}
