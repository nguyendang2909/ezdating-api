import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';

import { APP_CONFIG } from '../../app.config';
import { ERROR_MESSAGES } from '../../commons/messages/error-messages.constant';
import { GENDERS } from '../../constants';
import { Gender } from '../../types';
import { CommonModel } from './bases/common-model';
import { ProfileModel } from './profile.model';
import {
  BasicProfile,
  Profile,
  ProfileFilter,
  ProfileFilterDocument,
} from './schemas';

@Injectable()
export class ProfileFilterModel extends CommonModel<ProfileFilter> {
  constructor(
    @InjectModel(ProfileFilter.name)
    readonly model: Model<ProfileFilterDocument>,
    readonly profileModel: ProfileModel,
  ) {
    super();
    this.conflictMessage = ERROR_MESSAGES['Profile filter already exists'];
    this.notFoundMessage = ERROR_MESSAGES['Profile filter does not exist'];
  }

  async createOne(
    doc: Pick<
      ProfileFilter,
      '_id' | 'gender' | 'minAge' | 'maxAge' | 'maxDistance'
    >,
  ) {
    const createResult = await this.model.create(doc);
    return createResult.toJSON();
  }

  async createOneFromProfile(profile: Profile | BasicProfile) {
    const age = this.profileModel.getAgeFromBirthday(profile.birthday);
    return await this.createOne({
      _id: profile._id,
      gender: this.getFilterGender(profile.gender),
      minAge: age - 10 > 18 ? age - 10 : 18,
      maxAge: age + 10 < 100 ? age + 10 : 100,
      maxDistance: APP_CONFIG.USER_FILTER_MAX_DISTANCE,
    });
  }

  async findOneOrFail(
    filter: FilterQuery<ProfileFilter>,
    projection?: ProjectionType<ProfileFilter> | null | undefined,
    options?: QueryOptions<ProfileFilter> | null | undefined,
  ): Promise<ProfileFilter> {
    const existProfileFilter = await this.findOne(filter, projection, options);
    if (existProfileFilter) {
      return existProfileFilter;
    }
    if (!filter._id) {
      throw new NotFoundException(this.notFoundMessage);
    }
    const profile = await this.profileModel.findOneOrFailById(filter._id);
    const profileFilter = await this.createOneFromProfile(profile);
    return profileFilter;
  }

  getFilterGender(gender: Gender) {
    return gender === GENDERS.MALE ? GENDERS.FEMALE : GENDERS.MALE;
  }
}
