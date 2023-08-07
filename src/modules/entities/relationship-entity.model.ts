import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { FindManyOptions, FindOneOptions, Not, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import {
  RelationshipUserStatus,
  RelationshipUserStatuses,
} from '../../commons/constants/constants';
import { HttpErrorCodes } from '../../commons/erros/http-error-codes.constant';
import { EntityFindOneByIdOptions } from '../../commons/types/find-options.type';
import { Relationship } from './entities/relationship.entity';
import { User } from './entities/user.entity';
import { UserModel } from './user.model';

@Injectable()
export class RelationshipModel {
  constructor(
    @InjectRepository(Relationship)
    private readonly repository: Repository<Relationship>,
    private readonly userModel: UserModel,
  ) {}

  public async saveOne(entity: Partial<Relationship>, currentUserId: string) {
    return await this.repository.save({
      ...entity,
      createdBy: currentUserId,
      updatedBy: currentUserId,
    });
  }

  public async findMany(options: FindManyOptions<Relationship>) {
    return await this.repository.find({ ...options, take: 20 });
  }

  public async findOne(
    options: FindOneOptions<Relationship>,
  ): Promise<Relationship | null> {
    if (_.isEmpty(options.where)) {
      return null;
    }
    return await this.repository.findOne(options);
  }

  public async findOneOrFail(
    options: FindOneOptions<Relationship>,
  ): Promise<Relationship> {
    const findResult = await this.findOne(options);
    if (!findResult) {
      throw new NotFoundException({
        errorCode: HttpErrorCodes.RELATIONSHIP_DOES_NOT_EXIST,
        message: 'Relationship does not exist!',
      });
    }
    return findResult;
  }

  public async findOneConversationById(id: string, userId: string) {
    return await this.repository.findOne({
      where: [
        {
          id,
          userOneStatus: RelationshipUserStatuses.like,
          userTwoStatus: RelationshipUserStatuses.like,
        },
        {
          id,
          userOne: {
            id: userId,
          },
          userTwoStatus: Not(RelationshipUserStatuses.block),
          canUserOneChat: true,
        },
        {
          id,
          userTwo: {
            id: userId,
          },
          userOneStatus: Not(RelationshipUserStatuses.block),
          canUserTwoChat: true,
        },
      ],
    });
  }

  public async findOneById(
    id: string,
    options: EntityFindOneByIdOptions<Relationship>,
  ) {
    return await this.repository.findOne({
      ...options,
      where: { id },
    });
  }

  public async updateOneById(
    id: string,
    partialEntity: QueryDeepPartialEntity<Relationship>,
  ) {
    const updateResult = await this.repository.update(id, partialEntity);

    return !!updateResult.affected;
  }

  public async deleteOne(id: string) {
    return await this.repository.softDelete(id);
  }

  validateBlocked(entity: Relationship, isUserOne: boolean) {
    if (
      isUserOne
        ? entity.userTwoStatus === RelationshipUserStatuses.block
        : entity.userOneStatus === RelationshipUserStatuses.block
    ) {
      throw new BadRequestException({
        errorCode: HttpErrorCodes.USER_DOES_NOT_EXIST,
        message: 'User does not exist!',
      });
    }
  }

  validateConflictSendStatus(
    status: RelationshipUserStatus,
    entity: Relationship,
    isUserOne: boolean,
  ) {
    if (status === (isUserOne ? entity.userOneStatus : entity.userTwoStatus)) {
      throw new BadRequestException({
        errorCode: HttpErrorCodes.CONFLICT_RELATIONSHIP_STATUS,
        message: 'You already sent this status!',
      });
    }
  }

  sortUserIds(userIdOne: string, userIdTwo: string): string[] {
    // const sortedUserIds =
    return [userIdOne, userIdTwo].sort();
  }

  getIdFromSortedUserIds(userIds: string[]) {
    return userIds.join('_');
  }

  getIdFromUnsortedUserIds(userIds: string[]) {
    return userIds.sort().join('_');
  }

  getUserIdsFromId(id: string): string[] {
    return id.split('_');
  }

  public isUserOneBySortedIds(userId: string, userIds: string[]): boolean {
    return userId === userIds[0];
  }

  public isUserOneByEntities(userId: string, entities: User[]): boolean {
    return userId === entities[0]?.id;
  }

  public validateYourSelf(userId: string, targetUserId: string) {
    if (userId === targetUserId) {
      throw new BadRequestException({
        errorCode: HttpErrorCodes.CONFLICT_USER,
        message: 'You cannot send status yourself!',
      });
    }
  }

  formatConversation(entity: Relationship, currentUserId: string) {
    const { userOne, userTwo, ...partConversation } = entity;

    const userIds = this.getUserIdsFromId(entity.id);
    const isUserOne = this.isUserOneBySortedIds(currentUserId, userIds);

    return {
      ...partConversation,
      targetUser: isUserOne
        ? this.userModel.formatInConversation(userTwo)
        : this.userModel.formatInConversation(userOne),
    };
  }

  formatConversations(entities: Relationship[], currentUserId: string) {
    return entities.map((item) => {
      return this.formatConversation(item, currentUserId);
    });
  }
}
