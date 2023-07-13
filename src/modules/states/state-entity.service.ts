import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { HttpErrorCodes } from '../../commons/erros/http-error-codes.constant';
import { EntityFindOneByIdOptions } from '../../commons/types/find-options.type';
import { State } from './entities/state.entity';

@Injectable()
export class StateEntity {
  constructor(
    @InjectRepository(State)
    private readonly repository: Repository<State>,
  ) {}

  public async saveOne(entity: Partial<State>) {
    return await this.repository.save({
      ...entity,
    });
  }

  public async findAll(options: FindManyOptions<State>) {
    return await this.repository.find({ ...options });
  }

  public async findOne(options: FindOneOptions<State>): Promise<State | null> {
    if (_.isEmpty(options.where)) {
      return null;
    }
    return await this.repository.findOne(options);
  }

  public async findOneOrFail(
    options: FindOneOptions<State>,
  ): Promise<Partial<State>> {
    const findResult = await this.findOne(options);
    if (!findResult) {
      throw new NotFoundException({
        errorCode: HttpErrorCodes.STATE_DOES_NOT_EXIST,
        message: 'State does not exist!',
      });
    }
    return findResult;
  }

  public async findOneById(
    id: number,
    options: EntityFindOneByIdOptions<State>,
  ) {
    return await this.repository.findOne({
      ...options,
      where: { id },
    });
  }

  public async updateOne(id: number, partialEntity: Partial<State>) {
    return await this.repository.update(
      { id },
      {
        ...partialEntity,
      },
    );
  }

  public async deleteOne(id: number) {
    return await this.repository.delete({ id });
  }
}
