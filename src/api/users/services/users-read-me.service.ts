import { Injectable } from '@nestjs/common';

import { ApiReadMeService } from '../../../commons/services/api/api-read-me.base.service';
import { User, UserModel } from '../../../models';
import { ClientData } from '../../auth/auth.type';

@Injectable()
export class UsersReadMeService extends ApiReadMeService<User> {
  constructor(private readonly userModel: UserModel) {
    super();
  }

  async findOne(client: ClientData): Promise<User> {
    const { _currentUserId } = this.getClient(client);
    const user = await this.userModel.findOneOrFailById(_currentUserId, {
      password: false,
      _blockedByIds: false,
    });
    return user;
  }
}
