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
  constructor(@InjectModel(User.name) readonly model: Model<UserDocument>) {
    super();
  }

  public matchUserFields = {
    _id: 1,
    age: 1,
    createdAt: 1,
    educationLevel: 1,
    filterGender: 1,
    filterMaxAge: 1,
    filterMaxDistance: 1,
    filterMinAge: 1,
    gender: 1,
    height: 1,
    introduce: 1,
    lastActivatedAt: 1,
    mediaFiles: 1,
    nickname: 1,
    relationshipGoal: 1,
    relationshipStatus: 1,
    status: 1,
    weight: 1,
  };

  async createOne(doc: Partial<User>) {
    const { phoneNumber } = doc;
    if (!phoneNumber) {
      throw new BadRequestException('Phone number does not exist!');
    }
    return await this.model.create(doc);
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
      });
    }
    return findResult;
  }
}
