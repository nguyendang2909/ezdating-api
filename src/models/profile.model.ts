import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Types } from 'mongoose';

import { ERROR_MESSAGES } from '../commons/messages/error-messages.constant';
import { CacheService } from '../libs';
import { CommonModel } from './bases/common-model';
import { Profile, ProfileDocument } from './schemas/profile.schema';

@Injectable()
export class ProfileModel extends CommonModel<Profile> {
  constructor(
    @InjectModel(Profile.name) readonly model: Model<ProfileDocument>,
    private readonly cacheService: CacheService,
  ) {
    super();
    this.conflictMessage = ERROR_MESSAGES['Profile already exists'];
    this.notFoundMessage = ERROR_MESSAGES['Profile does not exist'];
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

    // fake
    learningTarget: 1,

    mediaFiles: {
      _id: 1,
      key: 1,
      type: 1,
    },
    nickname: 1,
    photoVerified: 1,
    relationshipGoal: 1,
    relationshipStatus: 1,
    school: 1,
    state: 1,

    // fake
    teachingSubject: 1,

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
    photoVerified: 1,
    state: 1,
  };

  async createOne(doc: Partial<Profile> & { _id: Types.ObjectId }) {
    const createResult = await this.model.create(doc);
    return createResult.toJSON();
  }

  // async findOneById(
  //   _id: Types.ObjectId,
  //   projection?: ProjectionType<Profile> | null | undefined,
  //   options?: QueryOptions<Profile> | null | undefined,
  // ): Promise<Profile | null> {
  //   const cacheKey = this.getCacheKey(_id);
  //   const cacheData = await this.findOneInCache(cacheKey);
  //   if (cacheData) {
  //     return cacheData;
  //   }
  //   const findResult = await this.findOne({ _id }, projection, options);
  //   if (findResult) {
  //     await this.cacheService.setex(cacheKey, 3600, findResult);
  //     return findResult;
  //   }
  //   return null;
  // }

  async findTwoOrFailPublicByIds(
    _userId: Types.ObjectId,
    _otherUserId: Types.ObjectId,
  ): Promise<{ profileOne: Profile; profileTwo: Profile }> {
    const [profileOne, profileTwo] = await this.findMany(
      {
        _id: { $in: [_userId, _otherUserId] },
      },
      this.publicFields,
      {
        sort: {
          _id: 1,
        },
        limit: 2,
        lean: true,
      },
    );
    if (!profileOne || !profileTwo) {
      throw new NotFoundException(ERROR_MESSAGES['User does not exist']);
    }
    return { profileOne, profileTwo };
  }

  // getCacheKey(_id: Types.ObjectId) {
  //   return `profile:${_id}`;
  // }

  // async findOneInCache(key: string) {
  //   return await this.cacheService.getJSON<Profile>(key);
  // }
}
