import {
  BadRequestException,
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import moment from 'moment';

import { APP_CONFIG } from '../../app.config';
import { HttpErrorMessages } from '../../commons/erros/http-error-messages.constant';
import { ApiService } from '../../commons/services/api.service';
import { EncryptionsUtil } from '../encryptions/encryptions.util';
import { SignedDeviceModel } from '../models/signed-device.model';
import { UserModel } from '../models/user.model';
import { LogoutDto } from './dto/logout.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable({ scope: Scope.REQUEST })
export class AuthService extends ApiService {
  constructor(
    private readonly signedDeviceModel: SignedDeviceModel,
    private readonly encryptionsUtil: EncryptionsUtil,
    @Inject(REQUEST) private request: Request & { user: { sub: string } },
    private readonly userModel: UserModel,
  ) {
    super();
  }

  public async logout(payload: LogoutDto): Promise<boolean> {
    const { refreshToken } = payload;

    const { id: currentUserId } =
      this.encryptionsUtil.verifyRefreshToken(refreshToken);

    const _currentUserId = this.getObjectId(currentUserId);

    const deleteRResult = await this.signedDeviceModel.model.deleteOne({
      _userId: _currentUserId,
      refreshToken,
    });

    if (!deleteRResult.deletedCount) {
      return false;
    }

    return true;
  }

  public async refreshAccessToken(payload: RefreshTokenDto) {
    const { id: currentUserId } = this.encryptionsUtil.verifyRefreshToken(
      payload.refreshToken,
    );
    const _currentUserId = this.getObjectId(currentUserId);
    const user = await this.userModel.findOneOrFail({
      _id: _currentUserId,
    });
    const { role, gender } = user;
    if (!role) {
      throw new BadRequestException({
        message: HttpErrorMessages['User data is incorrect.'],
      });
    }
    const accessToken = this.encryptionsUtil.signAccessToken({
      sub: currentUserId,
      id: currentUserId,
      role: role,
      gender,
    });

    return { accessToken };
  }

  public async refreshToken(payload: RefreshTokenDto) {
    const { refreshToken: currentRefreshToken } = payload;
    const { id: currentUserId } =
      this.encryptionsUtil.verifyRefreshToken(currentRefreshToken);
    const _currentUserId = this.getObjectId(currentUserId);
    await this.userModel.findOneOrFail({ _id: _currentUserId });
    const loggedDevice = await this.signedDeviceModel.findOneOrFail({
      refreshToken: currentRefreshToken,
    });
    const newRefreshToken = this.encryptionsUtil.signRefreshToken({
      id: currentUserId,
      sub: currentUserId,
    });

    const isUpdated = await this.signedDeviceModel.updateOneById(
      loggedDevice._id,
      {
        $set: {
          refreshToken: newRefreshToken,
          expiresIn: moment().add(APP_CONFIG.REFRESH_TOKEN_EXPIRES, 'days'),
        },
      },
    );
    if (!isUpdated) {
      throw new UnauthorizedException({
        message: 'Update refresh token failed!',
      });
    }

    return { refreshToken: newRefreshToken };
  }
}
