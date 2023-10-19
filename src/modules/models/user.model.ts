import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';

import { UserStatuses } from '../../commons/constants';
import { HttpErrorMessages } from '../../commons/erros/http-error-messages.constant';
import { CommonModel } from './common-model';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserModel extends CommonModel<User> {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {
    super();
    this.model = this.userModel;
  }

  public matchUserFields = {
    _id: true,
    age: true,
    filterGender: true,
    filterMaxAge: true,
    filterMaxDistance: true,
    filterMinAge: true,
    gender: true,
    introduce: true,
    lastActivatedAt: true,
    mediaFiles: true,
    nickname: true,
    relationshipGoal: true,
    status: true,
  };

  async createOne(doc: Partial<User>) {
    const { phoneNumber } = doc;
    if (!phoneNumber) {
      throw new BadRequestException('Phone number does not exist!');
    }
    return await this.model.create(doc);
  }

  async findOne(
    filter?: FilterQuery<User> | undefined,
    projection?: ProjectionType<User> | null | undefined,
    options?: QueryOptions<User> | null | undefined,
  ) {
    return await this.model.findOne(filter, projection, options);
  }

  public async findOneOrFail(
    filter: FilterQuery<User>,
    projection?: ProjectionType<User> | null,
    options?: QueryOptions<User> | null,
  ) {
    const findResult = await this.findOne(filter, projection, options);
    if (!findResult) {
      throw new NotFoundException({
        message: HttpErrorMessages['User does not exist'],
      });
    }
    const { status } = findResult;
    if (status === UserStatuses.banned) {
      throw new BadRequestException({
        message: 'User has been banned',
        errorCode: 'USER_BANNED',
      });
    }
    return findResult;
  }

  // public async findOneAndValidateBasicInfoById(id: string) {
  //   const user = await this.findOne({
  //     where: {
  //       id: id,
  //       status: UserStatuses.activated,
  //       haveBasicInfo: true,
  //     },
  //   });
  //   if (!user) {
  //     throw new NotFoundException({
  //       errorCode: HttpErrorCodes.USER_DOES_NOT_EXIST,
  //       message: 'User does not exist!',
  //     });
  //   }
  // }

  // public async findMany(
  //   filter: FilterQuery<UserDocument>,
  //   projection?: ProjectionType<UserDocument> | null | undefined,
  //   options?: QueryOptions<UserDocument> | null | undefined,
  // ): Promise<User[]> {
  //   return await this.model
  //     .find(filter, projection, {
  //       limit: 10,
  //       ...options,
  //     })
  //     .lean()
  //     .exec();
  // }

  // public formatInConversation(user: Partial<User>) {
  //   // eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
  //   const { birthday, password, email, phoneNumber, avatarFile, ...userPart } =
  //     user;
  //   return {
  //     ...userPart,
  //     ...(birthday ? { age: moment().diff(birthday, 'years') } : {}),
  //     avatarFile,
  //     ...(avatarFile ? { avatar: avatarFile.location } : {}),
  //   };
  // }

  // public formatInMessage(user: Partial<User>) {
  //   return {
  //     id: user.id,
  //     name: user.nickname,
  //     avatar: user.avatarFile?.location,
  //   };
  // }

  // formatRaw(user: Record<string, any>): User {
  //   const result: Record<string, any> = {};
  //   for (const key of Object.keys(user)) {
  //     if (key.startsWith('avatarfile')) {
  //       if (result.avatarFile) {
  //         result.avatarFile[_.camelCase(key.substring(10))] = user[key];
  //       } else {
  //         result.avatarFile = { [_.camelCase(key.substring(10))]: user[key] };
  //       }
  //     } else {
  //       result[_.camelCase(key)] = user[key];
  //     }
  //   }
  //   return result as User;
  // }

  // formatRaws(users: Record<string, any>[]) {
  //   return users.map(this.formatRaw);
  // }
}
