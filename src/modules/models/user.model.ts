import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import _ from 'lodash';
import {
  Document,
  FilterQuery,
  FlattenMaps,
  Model,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
  UpdateWithAggregationPipeline,
  UpdateWriteOpResult,
} from 'mongoose';
import { Types } from 'mongoose';

import { UserStatuses } from '../../commons/constants';
import { HttpErrorMessages } from '../../commons/erros/http-error-messages.constant';
import { CommonModel } from './common-model';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserModel extends CommonModel<User> {
  constructor(
    @InjectModel(User.name) public readonly model: Model<UserDocument>,
  ) {
    super();
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

  async createOne(
    doc: Partial<User>,
  ): Promise<
    FlattenMaps<Document<unknown, {}, User> & User & { _id: Types.ObjectId }>
  > {
    const { phoneNumber } = doc;
    if (!phoneNumber) {
      throw new BadRequestException('Phone number does not exist!');
    }
    const user = await this.model.create(doc);
    return user.toJSON();
  }

  // public async createOne(entity: Partial<User>) {
  //   const { phoneNumber } = entity;
  //   if (!phoneNumber) {
  //     throw new BadRequestException('Phone number does not exist!');
  //   }
  //   const user = await this.model.create(entity);

  //   return user.toJSON();
  // }

  public async findOne(
    filter: FilterQuery<UserDocument>,
    projection?: ProjectionType<UserDocument> | null,
    options?: QueryOptions<UserDocument> | null,
  ) {
    if (_.isEmpty(filter)) {
      return null;
    }
    return await this.model.findOne(filter, projection, options).lean().exec();
  }

  public async findOneOrFail(
    filter: FilterQuery<UserDocument>,
    projection?: ProjectionType<UserDocument> | null,
    options?: QueryOptions<UserDocument> | null,
  ) {
    const findResult = await this.findOne(filter, projection, options);
    if (!findResult) {
      throw new NotFoundException({
        errorCode: 'USER_DOES_NOT_EXIST',
        message: "User doesn't exist!",
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
  //   const user = await this.model.findOne({
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

  async updateOne(
    filter?: FilterQuery<User> | undefined,
    update?: any,
    options?: QueryOptions<User> | null | undefined,
  ): Promise<UpdateWriteOpResult> {
    return await this.model.updateOne(filter, update, options).exec();
  }

  async updateOneOrFail(
    filter?: FilterQuery<User> | undefined,
    update?: UpdateWithAggregationPipeline | UpdateQuery<User> | undefined,
    options?: QueryOptions<User> | null | undefined,
  ): Promise<void> {
    const updateResult = await this.updateOne(filter, update, options);
    if (!updateResult.modifiedCount) {
      throw new BadRequestException(
        HttpErrorMessages['Update failed. Please try again.'],
      );
    }
  }

  public async updateOneById(
    _id: Types.ObjectId,
    updateOptions: UpdateQuery<UserDocument>,
  ): Promise<boolean> {
    const updateResult = await this.model.updateOne(
      {
        _id,
      },
      updateOptions,
    );

    return !!updateResult.modifiedCount;
  }

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
