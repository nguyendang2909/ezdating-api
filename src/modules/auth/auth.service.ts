import {
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

import { TokenFactory } from '../../commons/lib/token-factory.lib';
import { LoggedDeviceEntity } from '../../logged-devices/logged-device-entity.service';
import { EncryptionsUtil } from '../encryptions/encryptions.util';
import { UserEntity } from '../users/users-entity.service';
import { RenewAccessTokenDto } from './dto/renew-access-token.dto';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    private readonly loggedDeviceEntity: LoggedDeviceEntity,
    private readonly encryptionsUtil: EncryptionsUtil,
    @Inject(REQUEST) private request: Request & { user: { sub: string } },
    private readonly userEntity: UserEntity,
  ) {}

  public async renewAccessToken(payload: RenewAccessTokenDto) {
    const currentAccessToken = TokenFactory.getAccessTokenFromHttpRequest(
      this.request,
    );
    if (!currentAccessToken) {
      throw new UnauthorizedException();
    }
    try {
      const decodedCurrentAccessToken = this.encryptionsUtil.verifyJwt(
        currentAccessToken,
        {
          ignoreExpiration: true,
        },
      );
      const { refreshToken } = payload;
      try {
        this.encryptionsUtil.verifyRefreshToken(refreshToken, {
          ignoreExpiration: true,
        });
      } catch (err) {
        throw new UnauthorizedException();
      }
      const user = await this.userEntity.findOneOrFailById(
        decodedCurrentAccessToken.id,
      );
      await this.userEntity.updateOneById(user.id, {
        lastActivatedAt: new Date(),
      });
      const accessToken = this.encryptionsUtil.signAccessToken({
        sub: user.id,
        id: user.id,
        role: user.role,
      });

      return { accessToken };
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  public async renewRefreshToken() {}
}
