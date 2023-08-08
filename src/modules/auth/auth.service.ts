import {
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import moment from 'moment';

import { EncryptionsUtil } from '../encryptions/encryptions.util';
import { LoggedDeviceModel } from '../entities/logged-device.model';
import { UserModel } from '../entities/user.model';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    private readonly loggedDeviceModel: LoggedDeviceModel,
    private readonly encryptionsUtil: EncryptionsUtil,
    @Inject(REQUEST) private request: Request & { user: { sub: string } },
    private readonly userModel: UserModel,
  ) {}

  public async refreshAccessToken(payload: RefreshTokenDto) {
    const refreshTokenPayload = this.encryptionsUtil.verifyRefreshToken(
      payload.refreshToken,
    );
    const user = await this.userModel.findOneOrFailById(
      refreshTokenPayload.sub,
    );

    const accessToken = this.encryptionsUtil.signAccessToken({
      sub: user.id,
      id: user.id,
      role: user.role,
      gender: user.gender,
    });

    return { accessToken };
  }

  public async refreshToken(payload: RefreshTokenDto) {
    const refreshTokenPayload = this.encryptionsUtil.verifyRefreshToken(
      payload.refreshToken,
    );

    await this.userModel.findOneOrFailById(refreshTokenPayload.id);
    const loggedDevice = await this.loggedDeviceModel.findOneOrFail({
      where: {
        user: { id: refreshTokenPayload.id },
      },
    });
    const refreshToken = this.encryptionsUtil.signRefreshToken({
      id: refreshTokenPayload.id,
      sub: refreshTokenPayload.id,
    });
    const isUpdated = await this.loggedDeviceModel.updateOneById(
      loggedDevice.id,
      {
        refreshToken,
        expiresIn: moment().add(90, 'days'),
      },
    );
    if (!isUpdated) {
      throw new UnauthorizedException();
    }

    return { refreshToken };
  }

  // public verifyAccessTokenFromRequest(): ClientData {
  //   const currentAccessToken = TokenFactory.getAccessTokenFromHttpRequest(
  //     this.request,
  //   );
  //   if (!currentAccessToken) {
  //     throw new UnauthorizedException();
  //   }

  //   return this.encryptionsUtil.verifyAccessToken(currentAccessToken, {
  //     ignoreExpiration: true,
  //   });
  // }
}
