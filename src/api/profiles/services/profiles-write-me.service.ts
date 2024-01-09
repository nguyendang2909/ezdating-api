import { Injectable } from '@nestjs/common';
import { UpdateQuery } from 'mongoose';

import { ApiWriteMeService } from '../../../commons/services/api/api-update-me.base.service';
import { ProfilesUtil } from '../../../utils';
import { ClientData } from '../../auth/auth.type';
import { Profile, ProfileModel, StateModel } from '../../../models';
import { UpdateMyProfileDto } from '../dto';

@Injectable()
export class ProfilesWriteMeService extends ApiWriteMeService<
  Profile,
  undefined,
  UpdateMyProfileDto
> {
  constructor(
    private readonly profileModel: ProfileModel,
    private readonly stateModel: StateModel,
    private readonly profilesUtil: ProfilesUtil,
  ) {
    super();
  }

  public async updateOne(
    payload: UpdateMyProfileDto,
    client: ClientData,
  ): Promise<void> {
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
          ? { birthday: this.profilesUtil.verifyBirthdayFromRaw(rawBirthday) }
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
