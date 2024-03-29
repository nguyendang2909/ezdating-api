import { Injectable } from '@nestjs/common';

import { ApiReadMeService } from '../../../commons/services/api/api-read-me.base.service';
import { ClientData } from '../../auth/auth.type';
import { ProfileFilter, ProfileFilterModel } from '../../../models';

@Injectable()
export class ProfileFiltersReadMeService extends ApiReadMeService<ProfileFilter> {
  constructor(private readonly profileFilterModel: ProfileFilterModel) {
    super();
  }

  async findOne(client: ClientData) {
    const { _currentUserId } = this.getClient(client);
    const findResult = await this.profileFilterModel.findOneOrFailById(
      _currentUserId,
    );
    return findResult;
  }
}
