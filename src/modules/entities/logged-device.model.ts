// import {
//   BadRequestException,
//   Injectable,
//   NotFoundException,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import _ from 'lodash';
// import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
// import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

// import { HttpErrorCodes } from '../../commons/erros/http-error-codes.constant';
// import { LoggedDevice } from '../entities/entities/logged-device.entity';

// @Injectable()
// export class LoggedDeviceModel {
//   constructor(
//     @InjectRepository(LoggedDevice)
//     private readonly repository: Repository<LoggedDevice>,
//   ) {}

//   public async saveOne(
//     entity: Partial<LoggedDevice>,
//     currentUserId: string,
//   ): Promise<LoggedDevice> {
//     return await this.repository.save({
//       ...entity,
//       createdBy: currentUserId,
//       updatedBy: currentUserId,
//     });
//   }

//   public async findOne(
//     options: FindOneOptions<LoggedDevice>,
//   ): Promise<LoggedDevice | null> {
//     if (_.isEmpty(options.where)) {
//       return null;
//     }
//     return await this.repository.findOne(options);
//   }

//   public async findOneOrFail(
//     options: FindOneOptions<LoggedDevice>,
//   ): Promise<LoggedDevice> {
//     const findResult = await this.findOne(options);
//     if (!findResult) {
//       throw new UnauthorizedException({
//         errorCode: HttpErrorCodes.USER_DOES_NOT_EXIST,
//         message: "User doesn't exist!",
//       });
//     }

//     return findResult;
//   }

//   public async findOneById(id: string) {
//     if (!id) {
//       return null;
//     }
//     return await this.repository.findOne({ where: { id } });
//   }

//   public async findOneOrFailById(id: string) {
//     const findResult = await this.findOneById(id);
//     if (!findResult) {
//       throw new BadRequestException({
//         errorCode: HttpErrorCodes.USER_DOES_NOT_EXIST,
//         message: "User doesn't exist!",
//       });
//     }

//     return findResult;
//   }

//   public async findOneAndValidateBasicInfoById(id: string) {
//     const user = await this.repository.findOne({
//       where: {
//         id: id,
//       },
//     });
//     if (!user) {
//       throw new NotFoundException({
//         errorCode: HttpErrorCodes.USER_DOES_NOT_EXIST,
//         message: 'User does not exist!',
//       });
//     }
//   }

//   public async findMany(
//     options: FindManyOptions<LoggedDevice>,
//   ): Promise<LoggedDevice[]> {
//     return await this.repository.find(options);
//   }

//   public async updateOneById(
//     id: string,
//     updateOptions: QueryDeepPartialEntity<LoggedDevice>,
//   ): Promise<boolean> {
//     const updateResult = await this.repository.update(id, updateOptions);
//     return !!updateResult.affected;
//   }
// }
