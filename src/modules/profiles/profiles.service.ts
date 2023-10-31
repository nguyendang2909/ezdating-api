import { ConflictException, Injectable } from '@nestjs/common';
import moment from 'moment';
import { UpdateQuery } from 'mongoose';

import { APP_CONFIG } from '../../app.config';
import { HttpErrorMessages } from '../../commons/erros/http-error-messages.constant';
import { GENDERS, RESPONSE_TYPES } from '../../constants';
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
    const existProfile = await this.profileModel.findOne({
      _id: _currentUserId,
    });
    if (existProfile) {
      throw new ConflictException(HttpErrorMessages['Profile is exist']);
    }
    const { birthday: rawBirthday, ...rest } = payload;
    const birthday = this.getAndCheckValidBirthdayFromRaw(rawBirthday);
    const age = this.getAgeFromBirthday(birthday);
    const createResult = await this.profileModel.createOne({
      _id: _currentUserId,
      ...rest,
      birthday,
      filterGender: this.getFilterGender(payload.gender),
      filterMinAge: age - 10 > 18 ? age - 10 : 18,
      filterMaxAge: age + 10,
      filterMaxDistance: APP_CONFIG.USER_FILTER_MAX_DISTANCE,
    });
    return createResult;
  }

  public async getMe(clientData: ClientData) {
    const { id: currentUserId } = clientData;
    const _currentUserId = this.getObjectId(currentUserId);
    const user = await this.profileModel.findOneOrFailById(_currentUserId);

    return user;
  }

  async findOneOrFailById(id: string, _client: ClientData) {
    const _id = this.getObjectId(id);
    const findResult = await this.profileModel.findOneOrFailById(_id, {
      geolocation: -1,
      filterGender: -1,
      filterMaxAge: -1,
      filterMinAge: -1,
      filterMaxDistance: -1,
    });
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
