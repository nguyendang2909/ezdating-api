import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
  Types,
} from 'mongoose';

import { ERROR_MESSAGES } from '../commons/messages/error-messages.constant';
import { USER_STATUSES } from '../constants';
import { SignInPayload } from '../types';
import { CommonModel } from './bases/common-model';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserModel extends CommonModel<User> {
  constructor(@InjectModel(User.name) readonly model: Model<UserDocument>) {
    super();
    this.conflictMessage = ERROR_MESSAGES['User already exists'];
    this.notFoundMessage = ERROR_MESSAGES['User does not exist'];
  }

  private readonly logger = new Logger(UserModel.name);

  // public matchUserFields = {
  //   _id: 1,
  //   age: 1,
  //   createdAt: 1,
  //   educationLevel: 1,
  //   filterGender: 1,
  //   filterMaxAge: 1,
  //   filterMaxDistance: 1,
  //   filterMinAge: 1,
  //   gender: 1,
  //   height: 1,
  //   introduce: 1,
  //   lastActivatedAt: 1,
  //   mediaFiles: 1,
  //   nickname: 1,
  //   relationshipGoal: 1,
  //   relationshipStatus: 1,
  //   status: 1,
  //   weight: 1,
  // };

  async createOne(doc: Partial<User>) {
    this.logger.log(`Create user with ${JSON.stringify(doc)}`);
    this.verifySignInPayload(doc);
    return await this.create(doc);
  }

  async create(doc: Partial<User>) {
    const createResult = await this.model.create(doc);
    return createResult.toJSON();
  }

  public async findOneOrFail(
    filter: FilterQuery<User>,
    projection?: ProjectionType<User> | null,
    options?: QueryOptions<User> | null,
  ) {
    const findResult = await this.findOne(filter, projection, options);
    if (!findResult) {
      throw new NotFoundException({
        message: ERROR_MESSAGES['User does not exist'],
      });
    }
    if (findResult.status === USER_STATUSES.BANNED) {
      throw new BadRequestException({
        message: 'User has been banned',
      });
    }
    return findResult;
  }

  public async findOneOrFailById(
    _id: Types.ObjectId,
    projection?: ProjectionType<User> | null,
    options?: QueryOptions<User> | null,
  ) {
    return await this.findOneOrFail({ _id }, projection, options);
  }

  async findOneOrCreate(payload: SignInPayload) {
    this.verifySignInPayload(payload);
    const user = await this.model.findOne(payload);
    if (user) {
      return this.verifyValid(user);
    }
    return await this.create(payload);
  }

  verifyValid(user: User): User {
    if (user.status === USER_STATUSES.BANNED) {
      throw new BadRequestException({
        message: 'User has been banned',
      });
    }
    return user;
  }

  verifySignInPayload(payload: SignInPayload): SignInPayload {
    if (
      !payload.phoneNumber &&
      !payload.email &&
      !payload.facebookId &&
      !payload.appleId
    ) {
      throw new BadRequestException(
        ERROR_MESSAGES[
          'You should sign in by phone number, google or facebook'
        ],
      );
    }
    return payload;
  }
}
