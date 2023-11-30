import { Injectable } from '@nestjs/common';

import { EncryptionsUtil } from '../../encryptions/encryptions.util';
import { UserModel } from '../../models';
import { AdminLoginDto } from './dto';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly userModel: UserModel,
    private readonly encryptionsUtil: EncryptionsUtil,
  ) {}

  async login(payload: AdminLoginDto) {
    const user = await this.userModel.findOneOrFail(payload);
    const accessToken = this.encryptionsUtil.signAccessTokenFromUser(user);
    return {
      accessToken,
    };
  }
}
