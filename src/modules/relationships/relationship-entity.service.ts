import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { Repository } from 'typeorm';

import {
  EntityFindManyOptions,
  EntityFindOneByIdOptions,
  EntityFindOneOptions,
} from '../../commons/types/find-options.type';
import { Relationship } from './entities/relationship.entity';

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

  public async findMany(options: EntityFindManyOptions<Relationship>) {
    return await this.repository.find({ ...options, take: 20 });
  }

  public async findOne(
    options: EntityFindOneOptions<Relationship>,
  ): Promise<Partial<Relationship> | null> {
    if (_.isEmpty(options.where)) {
      return null;
    }
    return await this.repository.findOne(options);
  }

  public async findOneOrFail(
    options: EntityFindOneOptions<Relationship>,
  ): Promise<Partial<Relationship>> {
    const findResult = await this.findOne(options);
    if (!findResult) {
      throw new NotFoundException('User not found!');
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

  public async updateOne(
    id: string,
    partialEntity: Partial<Relationship>,
    currentUserId: string,
  ) {
    return await this.repository.update(id, {
      ...partialEntity,
      updatedBy: currentUserId,
    });
  }

  public async deleteOne(id: string) {
    return await this.repository.softDelete(id);
  }
}
