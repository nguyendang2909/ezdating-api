import { InternalServerErrorException, Logger } from '@nestjs/common';
import moment from 'moment';
import mongoose from 'mongoose';

import { APP_CONFIG } from '../../../app.config';
import { CommonService } from '../../../commons';
import { ERROR_MESSAGES } from '../../../commons/messages';
import { SignInPayload, SignInPayloadWithToken } from '../../../types';
import { EncryptionsUtil } from '../../encryptions/encryptions.util';
import { ProfileModel, SignedDeviceModel, User, UserModel } from '../../models';
import { SignInData } from '../auth.type';
import { SignInDto } from '../dto';

export class CommonSignInService extends CommonService {
  constructor(
    protected readonly profileModel: ProfileModel,
    protected readonly userModel: UserModel,
    protected readonly signedDeviceModel: SignedDeviceModel,
    protected readonly encryptionsUtil: EncryptionsUtil,
  ) {
    super();
  }

  protected readonly logger = new Logger('SignInService');

  public async signIn(payload: SignInDto): Promise<SignInData> {
    const signInPayload = await this.getSignInPayload(payload);
    return await this.getTokensFromSignInPayload({
      deviceToken: payload.deviceToken,
      devicePlatform: payload.devicePlatform,
      ...signInPayload,
    });
  }

  async getSignInPayload(payload: SignInDto): Promise<SignInPayload> {
    throw new InternalServerErrorException(ERROR_MESSAGES['Not implemented']);
  }

  async getTokensFromSignInPayload(payload: SignInPayloadWithToken) {
    const { devicePlatform, deviceToken, ...rest } = payload;
    const user = await this.userModel.findOneOrCreate(rest);
    const { accessToken, refreshToken } = this.createTokens(user);
    await this.createSession({
      _userId: user._id,
      refreshToken,
      deviceToken,
      devicePlatform,
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  createTokens(user: User) {
    const userId = user._id.toString();
    const accessToken = this.encryptionsUtil.signAccessTokenFromUser(user);
    const refreshToken = this.encryptionsUtil.signRefreshToken({
      id: userId,
      sub: userId,
    });
    return { accessToken, refreshToken };
  }

  async createSession({
    _userId,
    refreshToken,
    deviceToken,
    devicePlatform,
  }: {
    _userId: mongoose.Types.ObjectId;
    refreshToken: string;
  } & SignInDto) {
    if (deviceToken && devicePlatform) {
      return await this.signedDeviceModel.findOneAndUpdate(
        { token: deviceToken },
        {
          _userId,
          refreshToken: refreshToken,
          expiresIn: moment()
            .add(APP_CONFIG.REFRESH_TOKEN_EXPIRES_AS_DAYS, 'days')
            .toDate(),
          token: deviceToken,
          platform: devicePlatform,
        },
        {
          new: true,
          upsert: true,
        },
      );
    }
    return await this.signedDeviceModel.createOne({
      _userId,
      refreshToken: refreshToken,
      expiresIn: moment()
        .add(APP_CONFIG.REFRESH_TOKEN_EXPIRES_AS_DAYS, 'days')
        .toDate(),
    });
  }
}
