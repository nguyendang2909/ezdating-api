import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { HttpErrorMessages } from '../../../commons/erros/http-error-messages.constant';
import { USER_STATUSES } from '../../../constants';
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
    if (!status || status === USER_STATUSES.BANNED) {
      throw new ForbiddenException({
        message: HttpErrorMessages['You have been banned'],
      });
    }
    const { _id: _userId, role } = user;
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
    });
    return {
      accessToken,
    };
  }
}
