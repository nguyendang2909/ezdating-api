import { Injectable } from '@nestjs/common';

import { ApiReadMeService } from '../../../commons/services/api/api-read-me.base.service';
import {
  BasicProfile,
  BasicProfileModel,
  Profile,
  ProfileModel,
} from '../../../models';
import { ClientData } from '../../auth/auth.type';

@Injectable()
export class ProfilesReadMeService extends ApiReadMeService<
  Profile | BasicProfile
> {
  constructor(
    private readonly profileModel: ProfileModel,
    private readonly basicProfileModel: BasicProfileModel,
  ) {
    super();
  }

  public async findOne(client: ClientData): Promise<Profile | BasicProfile> {
    const { id: currentUserId } = client;
    const _currentUserId = this.getObjectId(currentUserId);
    const profile = await this.profileModel.findOneById(_currentUserId);
    if (!profile) {
      return await this.basicProfileModel.findOneOrFailById(_currentUserId);
    }
    return profile;
  }
}
