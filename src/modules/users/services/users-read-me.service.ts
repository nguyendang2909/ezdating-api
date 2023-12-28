import { Injectable } from '@nestjs/common';
import _ from 'lodash';

import { ApiReadMeService } from '../../../commons/services/api/api-read-me.base.service';
import { ClientData } from '../../auth/auth.type';
import { User, UserModel } from '../../models';

@Injectable()
export class UsersReadMeService extends ApiReadMeService<User> {
  constructor(private readonly userModel: UserModel) {
    super();
  }

  async findOne(client: ClientData): Promise<User> {
    const { _currentUserId } = this.getClient(client);
    const user = await this.userModel.findOneOrFailById(_currentUserId);
    return _.omit(user, ['password']);
  }
}
