import { Injectable } from '@nestjs/common';

import { AccessTokensService } from '../../../libs';
import { UserModel } from '../../models';
import { AdminLoginDto } from './dto';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly userModel: UserModel,
    private readonly accessTokensService: AccessTokensService,
  ) {}

  async login(payload: AdminLoginDto) {
    const user = await this.userModel.findOneOrFail(payload);
    const accessToken = this.accessTokensService.signFromUser(user);
    return {
      accessToken,
    };
  }
}
