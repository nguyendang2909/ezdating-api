import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { HttpErrorCodes } from '../commons/erros/http-error-codes.constant';
import { RelationshipStatus } from './entities/relationship-status.entity';

@Injectable()
export class UserRelationshipStatusEntity {
  constructor(
    @InjectRepository(RelationshipStatus)
    private readonly repository: Repository<RelationshipStatus>,
  ) {}

  public async saveOne(
    entity: Partial<RelationshipStatus>,
  ): Promise<RelationshipStatus> {
    return await this.repository.save(entity);
  }

  public async findOne(
    options: FindOneOptions<RelationshipStatus>,
  ): Promise<RelationshipStatus | null> {
    if (_.isEmpty(options.where)) {
      return null;
    }
    return await this.repository.findOne(options);
  }

  public async findOneOrFail(
    options: FindOneOptions<RelationshipStatus>,
  ): Promise<RelationshipStatus> {
    const findResult = await this.findOne(options);
    if (!findResult) {
      throw new BadRequestException({
        errorCode: HttpErrorCodes.USER_RELATIONSHIP_STATUS_DOES_NOT_EXIST,
        message: 'User relationship status does not exist!',
      });
    }
    return findResult;
  }

  public async findAll(
    options: FindManyOptions<RelationshipStatus>,
  ): Promise<RelationshipStatus[]> {
    return await this.repository.find(options);
  }
}
