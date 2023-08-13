// import { BadRequestException, Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import _ from 'lodash';
// import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

// import { HttpErrorCodes } from '../../commons/erros/http-error-codes.constant';
// import { Job } from './entities/job.entity';

// @Injectable()
// export class JobModel {
//   constructor(
//     @InjectRepository(Job)
//     private readonly repository: Repository<Job>,
//   ) {}

//   public async findOne(options: FindOneOptions<Job>): Promise<Job | null> {
//     if (_.isEmpty(options.where)) {
//       return null;
//     }
//     return await this.repository.findOne(options);
//   }

//   public async findOneOrFail(options: FindOneOptions<Job>): Promise<Job> {
//     const findResult = await this.findOne(options);
//     if (!findResult) {
//       throw new BadRequestException({
//         errorCode: HttpErrorCodes.USER_RELATIONSHIP_STATUS_DOES_NOT_EXIST,
//         message: 'User relationship status does not exist!',
//       });
//     }
//     return findResult;
//   }

//   public async findAll(options: FindManyOptions<Job>): Promise<Job[]> {
//     return await this.repository.find(options);
//   }
// }
