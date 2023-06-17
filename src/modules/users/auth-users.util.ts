import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { EncryptionsUtil } from '../encryptions/encryptions.util';
import { User, userEntityName } from './entities/user.entity';
import { EUserRole, EUserStatus } from './users.constant';

@Injectable()
export class UsersAuthUtil {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly encryptionsUtil: EncryptionsUtil,
  ) {}

  private readonly logger = new Logger(UsersAuthUtil.name);

  private async onApplicationBootstrap() {
    try {
      const phoneNumber = '+84971016191';
      const existAdminUser = await this.userRepository.findOne({
        where: {
          phoneNumber,
        },
      });

      if (!existAdminUser && process.env.ADMIN_PASSWORD) {
        const adminUser = new User({
          phoneNumber,
          password: this.encryptionsUtil.hash(process.env.ADMIN_PASSWORD),
          nickname: 'Quynh',
          role: EUserRole.admin,
          status: EUserStatus.activated,
        });

        await this.userRepository.save(adminUser);
      }
    } catch (err) {
      this.logger.log(err);
    }
  }

  // public async findOne(
  //   findOneAuthUserConditions: FindOneAuthUserConditions,
  //   findOptions: FindOptions,
  // ): Promise<Partial<User> | null> {
  //   if (_.isEmpty(findOneAuthUserConditions)) {
  //     return null;
  //   }
  //   const { phoneNumber } = findOneAuthUserConditions;
  //   let query = this.findQuery();
  //   if (phoneNumber) {
  //     query = query.andWhere(`${userEntityName}.phoneNumber = :phoneNumber`, {
  //       phoneNumber,
  //     });
  //   }
  //   query = EntityFactory.getFindQueryByOptions(query, User, findOptions);

  //   return await query.getOne();
  // }

  // public async findOneOrFail(
  //   findOneAuthUserConditions: FindOneAuthUserConditions,
  //   findOptions: FindOptions,
  // ): Promise<Partial<User>> {
  //   const findResult = await this.findOne(
  //     findOneAuthUserConditions,
  //     findOptions,
  //   );
  //   if (!findResult) {
  //     throw new NotFoundException('User not found!');
  //   }

  //   return findResult;
  // }

  public async findOneById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  public async findOneOrFailById(id: string): Promise<Partial<User>> {
    const findResult = await this.findOneById(id);
    if (!findResult) {
      throw new NotFoundException('User not found!');
    }

    return findResult;
  }

  private findQuery(): SelectQueryBuilder<User> {
    return this.userRepository
      .createQueryBuilder(userEntityName)
      .select(`${userEntityName}.id`);
  }
}
