import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { UpdateQuery } from 'mongoose';

import { APP_CONFIG } from '../../app.config';
import { GENDERS } from '../../constants';
import { Gender } from '../../types';
import { ClientData } from '../auth/auth.type';
import { Profile, ProfileModel } from '../models';
import { CreateProfileDto } from './dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { ProfilesCommonService } from './profiles.common.service';

@Injectable()
export class ProfilesService extends ProfilesCommonService {
  constructor(private readonly profileModel: ProfileModel) {
    super();
  }

  public async createOne(payload: CreateProfileDto, client: ClientData) {
    const { _currentUserId } = this.getClient(client);
    await this.profileModel.findOneOrFail({ _id: _currentUserId });
    const { birthday: rawBirthday, ...updateDto } = payload;
    const birthday = this.getAndCheckValidBirthdayFromRaw(rawBirthday);
    const age = this.getAgeFromBirthday(birthday);
    await this.profileModel.updateOneById(_currentUserId, {
      $set: {
        ...updateDto,
        age,
        birthday,
        filterGender: this.getFilterGender(payload.gender),
        filterMinAge: age - 10 > 18 ? age - 10 : 18,
        filterMaxAge: age + 10,
        filterMaxDistance: APP_CONFIG.USER_FILTER_MAX_DISTANCE,
      },
    });
  }

  public async getMe(clientData: ClientData) {
    const { id: currentUserId } = clientData;
    const _currentUserId = this.getObjectId(currentUserId);
    const user = await this.profileModel.findOneOrFailById(_currentUserId);

    return user;
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
              age: this.getAgeFromBirthday(
                this.getAndCheckValidBirthdayFromRaw(rawBirthday),
              ),
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

  getFilterGender(gender: Gender) {
    if (gender === GENDERS.MALE) {
      return GENDERS.FEMALE;
    }

    return GENDERS.MALE;
  }

  getAgeFromBirthday(birthday: Date): number {
    return moment().diff(birthday, 'years');
  }
}
