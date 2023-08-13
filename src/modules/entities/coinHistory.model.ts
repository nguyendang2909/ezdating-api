// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import _ from 'lodash';
// import { FindOneOptions, Repository } from 'typeorm';

// import { CoinHistory } from './entities/coin-history.entity';
// import { Job } from './entities/job.entity';

// @Injectable()
// export class CoinHistoryModel {
//   constructor(
//     @InjectRepository(Job)
//     private readonly repository: Repository<CoinHistory>,
//   ) {}

//   public async saveOne(entity: Partial<CoinHistory>): Promise<CoinHistory> {
//     return await this.repository.save(entity);
//   }

//   public async findOne(
//     options: FindOneOptions<CoinHistory>,
//   ): Promise<CoinHistory | null> {
//     if (_.isEmpty(options.where)) {
//       return null;
//     }
//     return await this.repository.findOne(options);
//   }

//   // public async findOneOrFail(options: FindOneOptions<Job>): Promise<Job> {
//   //   const findResult = await this.findOne(options);
//   //   if (!findResult) {
//   //     throw new BadRequestException({
//   //       errorCode: HttpErrorCodes.USER_RELATIONSHIP_STATUS_DOES_NOT_EXIST,
//   //       message: 'User relationship status does not exist!',
//   //     });
//   //   }
//   //   return findResult;
//   // }

//   // public async findAll(options: FindManyOptions<Job>): Promise<Job[]> {
//   //   return await this.repository.find(options);
//   // }
// }
