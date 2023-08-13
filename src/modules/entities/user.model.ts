// import {
//   BadRequestException,
//   Injectable,
//   NotFoundException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import _ from 'lodash';
// import moment from 'moment';
// import {
//   FindManyOptions,
//   FindOneOptions,
//   Repository,
//   SelectQueryBuilder,
// } from 'typeorm';
// import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

// import { UserStatuses } from '../../commons/constants/constants';
// import { HttpErrorCodes } from '../../commons/erros/http-error-codes.constant';
// import { User } from './entities/user.entity';

// @Injectable()
// export class UserModel {
//   constructor(
//     @InjectRepository(User) private readonly repository: Repository<User>,
//   ) {}

//   async query(data: string, parameters?: any[]) {
//     return this.repository.manager.query(data, parameters);
//   }

//   createQueryBuilder(): SelectQueryBuilder<User> {
//     return this.repository.createQueryBuilder(User.name);
//   }

//   public create(user: any) {
//     return this.repository.create(user);
//   }

//   public async saveOne(entity: Partial<User>): Promise<User> {
//     const { phoneNumber } = entity;
//     if (!phoneNumber) {
//       throw new BadRequestException('Phone number does not exist!');
//     }
//     const user = this.repository.create({ phoneNumber });

//     return await this.repository.save(user);
//   }

//   public async findOne(options: FindOneOptions<User>): Promise<User | null> {
//     if (_.isEmpty(options.where)) {
//       return null;
//     }
//     return await this.repository.findOne(options);
//   }

//   public async findOneOrFail(options: FindOneOptions<User>): Promise<User> {
//     const findResult = await this.findOne(options);
//     if (!findResult) {
//       throw new BadRequestException({
//         errorCode: 'USER_DOES_NOT_EXIST',
//         message: "User doesn't exist!",
//       });
//     }
//     const { status } = findResult;
//     if (!status || status === UserStatuses.banned) {
//       throw new BadRequestException({
//         message: 'User has been banned',
//         errorCode: 'USER_BANNED',
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
//     const { status } = findResult;
//     if (!status || status === UserStatuses.banned) {
//       throw new BadRequestException({
//         message: 'User has been banned',
//         errorCode: HttpErrorCodes.USER_HAS_BEEN_BANNED,
//       });
//     }
//     return findResult;
//   }

//   public async findOneAndValidateBasicInfoById(id: string) {
//     const user = await this.repository.findOne({
//       where: {
//         id: id,
//         status: UserStatuses.activated,
//         haveBasicInfo: true,
//       },
//     });
//     if (!user) {
//       throw new NotFoundException({
//         errorCode: HttpErrorCodes.USER_DOES_NOT_EXIST,
//         message: 'User does not exist!',
//       });
//     }
//   }

//   // public async isActivatedById(id: string): Promise<User | null> {
//   //   const user = await this.userRepository.findOne({ where: { id } });
//   //   if (!user || user.status === UserStatusObj.banned) {
//   //     return null;
//   //   }
//   //   return user;
//   // }

//   public async findMany(options: FindManyOptions<User>): Promise<User[]> {
//     return await this.repository.find(options);
//   }

//   public async updateOneById(
//     id: string,
//     updateOptions: QueryDeepPartialEntity<User>,
//   ): Promise<boolean> {
//     const updateResult = await this.repository.update(id, {
//       ...updateOptions,
//     });
//     return !!updateResult.affected;
//   }

//   public formatInConversation(user: Partial<User>) {
//     // eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
//     const { birthday, password, email, phoneNumber, avatarFile, ...userPart } =
//       user;
//     return {
//       ...userPart,
//       ...(birthday ? { age: moment().diff(birthday, 'years') } : {}),
//       avatarFile,
//       ...(avatarFile ? { avatar: avatarFile.location } : {}),
//     };
//   }

//   public formatInMessage(user: Partial<User>) {
//     return {
//       id: user.id,
//       name: user.nickname,
//       avatar: user.avatarFile?.location,
//     };
//   }

//   formatRaw(user: Record<string, any>): User {
//     const result: Record<string, any> = {};
//     for (const key of Object.keys(user)) {
//       if (key.startsWith('avatarfile')) {
//         if (result.avatarFile) {
//           result.avatarFile[_.camelCase(key.substring(10))] = user[key];
//         } else {
//           result.avatarFile = { [_.camelCase(key.substring(10))]: user[key] };
//         }
//       } else {
//         result[_.camelCase(key)] = user[key];
//       }
//     }
//     return result as User;
//   }

//   formatRaws(users: Record<string, any>[]) {
//     return users.map(this.formatRaw);
//   }
// }
