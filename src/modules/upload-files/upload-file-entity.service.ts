import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';

import { HttpErrorCodes } from '../../commons/erros/http-error-codes.constant';
import {
  EntityCountOptions,
  EntityFindManyOptions,
  EntityFindOneByIdOptions,
} from '../../commons/types/find-options.type';
import { UploadFile } from './entities/upload-file.entity';

@Injectable()
export class UploadFileEntity {
  constructor(
    @InjectRepository(UploadFile)
    private readonly repository: Repository<UploadFile>,
  ) {}

  public async saveOne(entity: Partial<UploadFile>, currentUserId: string) {
    return await this.repository.save({
      ...entity,
      createdBy: currentUserId,
      updatedBy: currentUserId,
    });
  }

  public async findMany(options: EntityFindManyOptions<UploadFile>) {
    return await this.repository.find({ ...options, take: 20 });
  }

  public async count(options: EntityCountOptions<UploadFile>) {
    return await this.repository.count({ ...options, take: 20 });
  }

  public async findOne(
    options: FindOneOptions<UploadFile>,
  ): Promise<Partial<UploadFile> | null> {
    if (_.isEmpty(options.where)) {
      return null;
    }
    return await this.repository.findOne(options);
  }

  public async findOneOrFail(
    options: FindOneOptions<UploadFile>,
  ): Promise<Partial<UploadFile>> {
    const findResult = await this.findOne(options);

    if (!findResult) {
      throw new NotFoundException({
        errorCode: HttpErrorCodes.FILE_DOES_NOT_EXIST,
        message: 'File does not exist!',
      });
    }

    return findResult;
  }

  public async findOneById(
    id: string,
    options: EntityFindOneByIdOptions<UploadFile>,
  ) {
    return await this.repository.findOne({
      ...options,
      where: { id },
    });
  }

  public async updateOne(
    id: string,
    partialEntity: Partial<UploadFile>,
    currentUserId: string,
  ) {
    return await this.repository.update(id, {
      ...partialEntity,
      updatedBy: currentUserId,
    });
  }

  public async deleteOne(options: FindOptionsWhere<UploadFile>) {
    return await this.repository.softDelete(options);
  }
}
