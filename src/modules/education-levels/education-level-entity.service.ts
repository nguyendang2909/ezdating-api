import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { HttpErrorCodes } from '../../commons/erros/http-error-codes.constant';
import { EducationLevel } from './entities/education-level.entity';

@Injectable()
export class EducationLevelEntity {
  constructor(
    @InjectRepository(EducationLevel)
    private readonly repository: Repository<EducationLevel>,
  ) {}

  public async findOne(
    options: FindOneOptions<EducationLevel>,
  ): Promise<EducationLevel | null> {
    if (_.isEmpty(options.where)) {
      return null;
    }
    return await this.repository.findOne(options);
  }

  public async findOneOrFail(
    options: FindOneOptions<EducationLevel>,
  ): Promise<EducationLevel> {
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
    options: FindManyOptions<EducationLevel>,
  ): Promise<EducationLevel[]> {
    return await this.repository.find(options);
  }
}
