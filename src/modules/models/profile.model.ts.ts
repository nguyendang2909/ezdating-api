import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';
import { Types } from 'mongoose';

import { HttpErrorMessages } from '../../commons/erros/http-error-messages.constant';
import { CommonModel } from './common-model';
import { Profile, ProfileDocument } from './schemas/profile.schema';

@Injectable()
export class ProfileModel extends CommonModel<Profile> {
  constructor(
    @InjectModel(Profile.name) readonly model: Model<ProfileDocument>,
  ) {
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

  async createOne(doc: Partial<Profile> & { _userId: Types.ObjectId }) {
    return await this.model.create(doc);
  }

  public async findOneOrFail(
    filter: FilterQuery<Profile>,
    projection?: ProjectionType<Profile> | null,
    options?: QueryOptions<Profile> | null,
  ) {
    const findResult = await this.findOne(filter, projection, options);
    if (!findResult) {
      throw new NotFoundException({
        message: HttpErrorMessages['Profile does not exist'],
      });
    }
    return findResult;
  }
}
