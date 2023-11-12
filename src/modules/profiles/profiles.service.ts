import { Injectable } from '@nestjs/common';
import { UpdateQuery } from 'mongoose';

import { RESPONSE_TYPES } from '../../constants';
import { ClientData } from '../auth/auth.type';
import { Profile, ProfileFilterModel, ProfileModel } from '../models';
import { CreateProfileDto } from './dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { ProfilesCommonService } from './profiles.common.service';

@Injectable()
export class ProfilesService extends ProfilesCommonService {
  constructor(
    private readonly profileModel: ProfileModel,
    private readonly profileFilterModel: ProfileFilterModel,
  ) {
    super();
  }

  public async createOne(payload: CreateProfileDto, client: ClientData) {
    const { _currentUserId } = this.getClient(client);
    let [profile, profileFilter] = await Promise.all([
      this.profileModel.findOne({
        _id: _currentUserId,
      }),
      this.profileFilterModel.findOne({
        _id: _currentUserId,
      }),
    ]);
    if (profile && profileFilter) {
      return { profile, profileFilter };
    }
    const { birthday: rawBirthday, ...rest } = payload;
    const birthday = this.getAndCheckValidBirthdayFromRaw(rawBirthday);
    if (!profile) {
      profile = await this.profileModel.createOne({
        _id: _currentUserId,
        ...rest,
        birthday,
      });
    }
    if (!profileFilter) {
      profileFilter = await this.profileFilterModel.createOneFromProfile(
        profile,
      );
    }
    return { profile, profileFilter };
  }

  public async getMe(clientData: ClientData) {
    const { id: currentUserId } = clientData;
    const _currentUserId = this.getObjectId(currentUserId);
    const user = await this.profileModel.findOneOrFailById(_currentUserId);

    return user;
  }

  async findOneOrFailById(id: string, _client: ClientData) {
    const _id = this.getObjectId(id);
    const findResult = await this.profileModel.findOneOrFailById(_id);
    return {
      type: RESPONSE_TYPES.PROFILE,
      data: findResult,
    };
  }

  public async updateMe(payload: UpdateMyProfileDto, client: ClientData) {
    const {
      longitude,
      latitude,
      birthday: rawBirthday,
      ...updateDto
    } = payload;
    const { _currentUserId } = this.getClient(client);
    const updateOptions: UpdateQuery<Profile> = {
      $set: {
        ...updateDto,
        ...(rawBirthday
          ? {
              birthday: this.getAndCheckValidBirthdayFromRaw(rawBirthday),
            }
          : {}),
        ...(longitude && latitude
          ? {
              geolocation: {
                type: 'Point',
                coordinates: [longitude, latitude],
              },
            }
          : {}),
      },
    };
    await this.profileModel.updateOneById(_currentUserId, updateOptions);
  }
}
