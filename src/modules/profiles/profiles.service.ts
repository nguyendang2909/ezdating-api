import { Injectable, Logger } from '@nestjs/common';
import { UpdateQuery } from 'mongoose';

import { RESPONSE_TYPES } from '../../constants';
import { ClientData } from '../auth/auth.type';
import {
  BasicProfileModel,
  Profile,
  ProfileFilterModel,
  ProfileModel,
  StateModel,
} from '../models';
import { CreateBasicProfileDto } from './dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { ProfilesCommonService } from './profiles.common.service';

@Injectable()
export class ProfilesService extends ProfilesCommonService {
  constructor(
    private readonly profileModel: ProfileModel,
    private readonly profileFilterModel: ProfileFilterModel,
    private readonly stateModel: StateModel,
    private readonly basicProfileModel: BasicProfileModel,
  ) {
    super();
  }

  private readonly logger = new Logger(ProfilesService.name);

  public async createBasic(payload: CreateBasicProfileDto, client: ClientData) {
    const { _currentUserId } = this.getClient(client);
    await this.basicProfileModel.findOneAndFailById(_currentUserId);
    await this.profileModel.findOneAndFailById(_currentUserId);
    const {
      birthday: rawBirthday,
      stateId,
      latitude,
      longitude,
      ...rest
    } = payload;
    const state = await this.stateModel.findOneOrFailById(
      this.getObjectId(stateId),
    );
    const birthday = this.getAndCheckValidBirthdayFromRaw(rawBirthday);
    const basicProfile = await this.basicProfileModel.createOne({
      _id: _currentUserId,
      ...rest,
      state,
      birthday,
      ...(longitude && latitude
        ? { geolocation: { type: 'Point', coordinates: [longitude, latitude] } }
        : {}),
    });
    await this.profileFilterModel
      .createOneFromProfile(basicProfile)
      .catch((error) => {
        this.logger.error(
          `Failed to create profile filter from profile: ${JSON.stringify(
            basicProfile,
          )} with error ${JSON.stringify(error)}`,
        );
      });
    return basicProfile;
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
      stateId,
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
        ...(stateId
          ? {
              state: await this.stateModel.findOneOrFailById(
                this.getObjectId(stateId),
              ),
            }
          : {}),
      },
    };
    await this.profileModel.updateOneById(_currentUserId, updateOptions);
  }
}
