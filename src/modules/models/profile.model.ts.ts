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

  public publicFields = {
    _id: 1,
    birthday: 1,
    company: 1,
    createdAt: 1,
    distance: 1,
    educationLevel: 1,
    gender: 1,
    height: 1,
    hideAge: 1,
    hideDistance: 1,
    introduce: 1,
    jobTitle: 1,
    languages: 1,
    lastActivatedAt: 1,
    mediaFiles: {
      _id: 1,
      key: 1,
      type: 1,
    },
    nickname: 1,
    relationshipGoal: 1,
    relationshipStatus: 1,
    school: 1,
    weight: 1,
  };

  public matchProfileFields = {
    _id: 1,
    birthday: 1,
    createdAt: 1,
    gender: 1,
    hideAge: 1,
    hideDistance: 1,
    mediaFiles: {
      _id: 1,
      key: 1,
      type: 1,
    },
    nickname: 1,
  };

  async createOne(doc: Partial<Profile> & { _id: Types.ObjectId }) {
    const createResult = await this.model.create(doc);
    return createResult.toJSON();
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

  async findTwoOrFailMatchProfiles(
    _userId: Types.ObjectId,
    _otherUserId: Types.ObjectId,
  ) {
    const [profileOne, profileTwo] = await this.findMany(
      {
        _id: { $in: [_userId, _otherUserId] },
      },
      this.matchProfileFields,
      {
        sort: {
          _id: 1,
        },
        limit: 2,
        lean: true,
      },
    );
    if (!profileOne || !profileTwo) {
      throw new NotFoundException(HttpErrorMessages['User does not exist']);
    }
    return [profileOne, profileTwo];
  }
}
