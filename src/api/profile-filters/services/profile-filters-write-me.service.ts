import { Injectable } from '@nestjs/common';

import { ApiWriteMeService } from '../../../commons/services/api/api-update-me.base.service';
import { ClientData } from '../../auth/auth.type';
import { ProfileFilter, ProfileFilterModel } from '../../models';
import { UpdateProfileFilterDto } from '../dto';

@Injectable()
export class ProfileFiltersWriteMeService extends ApiWriteMeService<ProfileFilter> {
  constructor(private readonly profileFilterModel: ProfileFilterModel) {
    super();
  }

  async updateOne(payload: UpdateProfileFilterDto, client: ClientData) {
    const { _currentUserId } = this.getClient(client);
    await this.profileFilterModel.updateOneById(_currentUserId, payload);
  }
}
