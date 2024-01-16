import { Injectable } from '@nestjs/common';

import { ApiReadService } from '../../../commons/services/api/api-read.base.service';
import { BasicProfile, Profile, ProfileModel } from '../../../models';
import { ClientData } from '../../auth/auth.type';
import { CreateBasicProfileDto } from '../dto';

@Injectable()
export class ProfilesReadService extends ApiReadService<
  BasicProfile | Profile,
  CreateBasicProfileDto
> {
  constructor(protected readonly profileModel: ProfileModel) {
    super();
  }

  async findOneById(id: string, _client: ClientData) {
    const _id = this.getObjectId(id);
    const findResult = await this.profileModel.findOneOrFailById(_id);
    return findResult;
  }
}
