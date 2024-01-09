import { Injectable, UnauthorizedException } from '@nestjs/common';
import moment from 'moment';

import { APP_CONFIG } from '../../app.config';
import { ApiBaseService } from '../../commons';
import { ERROR_MESSAGES } from '../../commons/messages';
import { AccessTokensService, RefreshTokensService } from '../../libs';
import { SignedDeviceModel } from '../../models/signed-device.model';
import { UserModel } from '../../models/user.model';
import { LogoutDto } from './dto/logout.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService extends ApiBaseService {
  constructor(
    private readonly signedDeviceModel: SignedDeviceModel,
    private readonly userModel: UserModel,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly accessTokensService: AccessTokensService,
  ) {
    super();
  }

  public async logout(payload: LogoutDto) {
    const { refreshToken } = payload;
    const { id: currentUserId } =
      this.refreshTokensService.verify(refreshToken);
    const _currentUserId = this.getObjectId(currentUserId);
    await this.signedDeviceModel.deleteOne({
      _userId: _currentUserId,
      refreshToken,
    });
  }

  public async refreshAccessToken(payload: RefreshTokenDto) {
    const { id: currentUserId } = this.refreshTokensService.verify(
      payload.refreshToken,
    );
    const _currentUserId = this.getObjectId(currentUserId);
    const user = await this.userModel.findOneOrFail({
      _id: _currentUserId,
    });
    const accessToken = this.accessTokensService.signFromUser(user);
    return { accessToken };
  }

  public async refreshToken(payload: RefreshTokenDto) {
    const { refreshToken: currentRefreshToken } = payload;
    const { id: currentUserId } =
      this.refreshTokensService.verify(currentRefreshToken);
    const _currentUserId = this.getObjectId(currentUserId);
    await this.userModel.findOneOrFail({ _id: _currentUserId });
    const loggedDevice = await this.signedDeviceModel.findOneOrFail({
      refreshToken: currentRefreshToken,
    });
    const newRefreshToken = this.refreshTokensService.sign({
      id: currentUserId,
      sub: currentUserId,
    });
    const updateResult = await this.signedDeviceModel.updateOneById(
      loggedDevice._id,
      {
        $set: {
          refreshToken: newRefreshToken,
          expiresIn: moment().add(
            APP_CONFIG.REFRESH_TOKEN_EXPIRES_AS_DAYS,
            'days',
          ),
        },
      },
    );
    if (!updateResult.modifiedCount) {
      throw new UnauthorizedException({
        message: ERROR_MESSAGES['Update refresh token failed'],
      });
    }
    return { refreshToken: newRefreshToken };
  }
}
