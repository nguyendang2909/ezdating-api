import {
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import moment from 'moment';

import { TokenFactory } from '../../commons/lib/token-factory.lib';
import { EncryptionsUtil } from '../encryptions/encryptions.util';
import { LoggedDeviceModel } from '../entities/logged-device.model';
import { UserModel } from '../entities/user.model';
import { AccessTokenPayload } from './auth.type';
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
    const accessTokenPayload = this.verifyAccessTokenFromRequest();
    const { refreshToken } = payload;
    const refreshTokenPayload =
      this.encryptionsUtil.verifyRefreshToken(refreshToken);
    const userId = accessTokenPayload.id;
    if (userId !== refreshTokenPayload.id) {
      throw new UnauthorizedException();
    }
    const accessToken = this.encryptionsUtil.signAccessToken({
      sub: accessTokenPayload.id,
      id: accessTokenPayload.id,
      role: accessTokenPayload.role,
    });

    return { accessToken };
  }

  public async refreshToken(payload: RefreshTokenDto) {
    const acessTokenPayload = this.verifyAccessTokenFromRequest();
    const { refreshToken: currentRefreshToken } = payload;
    const refreshTokenPayload =
      this.encryptionsUtil.verifyRefreshToken(currentRefreshToken);
    const userId = acessTokenPayload.id;
    if (userId !== refreshTokenPayload.id) {
      throw new UnauthorizedException();
    }
    await this.userModel.findOneOrFailById(userId);
    const loggedDevice = await this.loggedDeviceModel.findOneOrFail({
      where: {
        user: { id: userId },
      },
    });
    const refreshToken = this.encryptionsUtil.signRefreshToken({
      id: userId,
      sub: userId,
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

  public verifyAccessTokenFromRequest(): AccessTokenPayload {
    const currentAccessToken = TokenFactory.getAccessTokenFromHttpRequest(
      this.request,
    );
    if (!currentAccessToken) {
      throw new UnauthorizedException();
    }

    return this.encryptionsUtil.verifyAccessToken(currentAccessToken, {
      ignoreExpiration: true,
    });
  }
}
