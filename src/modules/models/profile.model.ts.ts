import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ProjectionType, QueryOptions } from 'mongoose';
import { Types } from 'mongoose';

import { HttpErrorMessages } from '../../commons/erros/http-error-messages.constant';
import { CacheService } from '../../libs';
import { CommonModel } from './common-model';
import { Profile, ProfileDocument } from './schemas/profile.schema';

@Injectable()
export class ProfileModel extends CommonModel<Profile> {
  constructor(
    @InjectModel(Profile.name) readonly model: Model<ProfileDocument>,
    private readonly cacheService: CacheService,
  ) {
    super();
    this.notFoundMessage = HttpErrorMessages['Profile does not exist'];
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

  async findOneById(
    _id: Types.ObjectId,
    projection?: ProjectionType<Profile> | null | undefined,
    options?: QueryOptions<Profile> | null | undefined,
  ): Promise<Profile | null> {
    const redisKey = this.getRedisKey(_id);
    const redisData = await this.cacheService.getJSON<Profile>(redisKey);
    if (redisData) {
      return redisData;
    }
    const findResult = await this.findOne({ _id }, projection, options);
    if (findResult) {
      await this.cacheService.setex(redisKey, 3600, findResult);
      return findResult;
    }
    return null;
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

  getRedisKey(_id: Types.ObjectId) {
    return `profile:${_id}`;
  }
}
