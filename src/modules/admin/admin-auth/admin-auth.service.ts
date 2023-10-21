import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UserStatuses } from '../../../commons/constants';
import { HttpErrorMessages } from '../../../commons/erros/http-error-messages.constant';
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
    const { phoneNumber } = payload;
    const user = await this.userModel.findOne({ phoneNumber });
    if (!user) {
      throw new NotFoundException(HttpErrorMessages['User does not exist']);
    }
    const { status } = user;
    if (!status || status === UserStatuses.banned) {
      throw new ForbiddenException({
        message: HttpErrorMessages['You have been banned'],
      });
    }
    const { _id: _userId, role, gender } = user;
    if (!_userId || !role) {
      throw new NotFoundException({
        message: 'User data is incorrect!',
      });
    }
    const userId = _userId.toString();
    const accessToken = this.encryptionsUtil.signAccessToken({
      sub: userId,
      id: userId,
      role,
      gender,
    });
    return {
      accessToken,
    };
  }
}
