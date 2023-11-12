import { Injectable } from '@nestjs/common';

import { ApiService } from '../../commons';
import { ClientData } from '../auth/auth.type';
import { ProfileFilterModel } from '../models';
import { UpdateProfileFilterDto } from './dto';

@Injectable()
export class ProfileFiltersService extends ApiService {
  constructor(private readonly profileFilterModel: ProfileFilterModel) {
    super();
  }

  async updateMe(payload: UpdateProfileFilterDto, client: ClientData) {
    const { _currentUserId } = this.getClient(client);
    await this.profileFilterModel.updateOneById(_currentUserId, payload);
  }

  async getMe(client: ClientData) {
    const { _currentUserId } = this.getClient(client);
    return await this.profileFilterModel.findOneOrFailById(_currentUserId);
  }
}
