import { BadRequestException, Injectable } from '@nestjs/common';

import {
  AccessTokensService,
  GoogleOAuthService,
  RefreshTokensService,
} from '../../../libs';
import { SignInPayload } from '../../../types';
import { ProfileModel } from '../../models';
import { SignedDeviceModel } from '../../models/signed-device.model';
import { UserModel } from '../../models/user.model';
import { SignInWithGoogleDto } from '../dto';
import { CommonSignInService } from './common-sign-in.service';

@Injectable()
export class SignInGoogleService extends CommonSignInService {
  constructor(
    protected readonly userModel: UserModel,
    protected readonly signedDeviceModel: SignedDeviceModel,
    protected readonly googleOauthService: GoogleOAuthService,
    protected readonly profileModel: ProfileModel,
    protected readonly accessTokensService: AccessTokensService,
    protected readonly refreshTokensService: RefreshTokensService,
  ) {
    super(
      userModel,
      profileModel,
      signedDeviceModel,
      accessTokensService,
      refreshTokensService,
    );
  }

  async getSignInPayload(payload: SignInWithGoogleDto): Promise<SignInPayload> {
    const loginTicket = await this.googleOauthService.oauthClient.verifyIdToken(
      { idToken: payload.token },
    );
    const loginTicketPayload = loginTicket.getPayload();
    if (!loginTicketPayload) {
      throw new BadRequestException();
    }
    return { email: loginTicketPayload.email };
  }
}
