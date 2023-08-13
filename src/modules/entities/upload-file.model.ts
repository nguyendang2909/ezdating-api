// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import _ from 'lodash';
// import {
//   FindManyOptions,
//   FindOneOptions,
//   FindOptionsWhere,
//   Repository,
// } from 'typeorm';

// import { HttpErrorCodes } from '../../commons/erros/http-error-codes.constant';
// import { EntityFindOneByIdOptions } from '../../commons/types/find-options.type';
// import { UploadFile } from './entities/upload-file.entity';

// @Injectable()
// export class UploadFileModel {
//   constructor(
//     @InjectRepository(UploadFile)
//     private readonly repository: Repository<UploadFile>,
//   ) {}

//   public async saveOne(entity: Partial<UploadFile>, currentUserId: string) {
//     return await this.repository.save({
//       ...entity,
//       createdBy: currentUserId,
//       updatedBy: currentUserId,
//     });
//   }

//   public async findMany(options: FindManyOptions<UploadFile>) {
//     return await this.repository.find({ ...options, take: 6 });
//   }

//   public async count(options: FindManyOptions<UploadFile>) {
//     return await this.repository.count({ ...options, take: 6 });
//   }

//   public async findOne(
//     options: FindOneOptions<UploadFile>,
//   ): Promise<Partial<UploadFile> | null> {
//     if (_.isEmpty(options.where)) {
//       return null;
//     }
//     return await this.repository.findOne(options);
//   }

//   public async findOneOrFail(
//     options: FindOneOptions<UploadFile>,
//   ): Promise<Partial<UploadFile>> {
//     const findResult = await this.findOne(options);

//     if (!findResult) {
//       throw new NotFoundException({
//         errorCode: HttpErrorCodes.FILE_DOES_NOT_EXIST,
//         message: 'File does not exist!',
//       });
//     }

//     return findResult;
//   }

//   public async findOneById(
//     id: string,
//     options: EntityFindOneByIdOptions<UploadFile>,
//   ) {
//     return await this.repository.findOne({
//       ...options,
//       where: { id },
//     });
//   }

//   public async updateOne(id: string, partialEntity: Partial<UploadFile>) {
//     return await this.repository.update(id, partialEntity);
//   }

//   public async deleteOne(options: FindOptionsWhere<UploadFile>) {
//     const deleteResult = await this.repository.delete(options);
//     return !!deleteResult.affected;
//   }
// }
