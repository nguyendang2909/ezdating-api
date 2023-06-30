import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { HttpErrorCodes } from '../../commons/erros/http-error-codes.constant';
import { EntityFindOneByIdOptions } from '../../commons/types/find-options.type';
import { Relationship } from './entities/relationship.entity';
import {
  RelationshipUserStatus,
  RelationshipUserStatuses,
} from './relationships.constant';

@Injectable()
export class RelationshipEntity {
  constructor(
    @InjectRepository(Relationship)
    private readonly repository: Repository<Relationship>,
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
    partialEntity: Partial<Relationship>,
    userId: string,
  ) {
    const updateResult = await this.repository.update(id, {
      ...partialEntity,
      updatedBy: userId,
    });

    return !!updateResult.affected;
  }

  public async deleteOne(id: string) {
    return await this.repository.softDelete(id);
  }

  validateBlocked(entity: Relationship, isUserOne: boolean) {
    if (
      isUserOne
        ? entity.userTwoStatus === RelationshipUserStatuses.block
        : entity.userOneStatus !== RelationshipUserStatuses.block
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
}
