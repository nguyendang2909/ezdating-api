import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { EntityFindOneByIdOptions } from '../../commons/types/find-options.type';
import { Country } from './entities/country.entity';

@Injectable()
export class CountryEntity {
  constructor(
    @InjectRepository(Country)
    private readonly repository: Repository<Country>,
  ) {}

  public async saveOne(entity: Partial<Country>) {
    return await this.repository.save({
      ...entity,
    });
  }

  public async findAll(options: FindManyOptions<Country>) {
    return await this.repository.find({ ...options });
  }

  public async findOne(
    options: FindOneOptions<Country>,
  ): Promise<Country | null> {
    if (_.isEmpty(options.where)) {
      return null;
    }
    return await this.repository.findOne(options);
  }

  public async findOneOrFail(
    options: FindOneOptions<Country>,
  ): Promise<Partial<Country>> {
    const findResult = await this.findOne(options);
    if (!findResult) {
      throw new NotFoundException({
        errorCode: 'COUNTRY_DOES_NOT_EXIST',
        message: 'Country doesnot exist!',
      });
    }
    return findResult;
  }

  public async findOneById(
    id: number,
    options: EntityFindOneByIdOptions<Country>,
  ) {
    return await this.repository.findOne({
      ...options,
      where: { id },
    });
  }

  public async updateOne(id: number, partialEntity: Partial<Country>) {
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
