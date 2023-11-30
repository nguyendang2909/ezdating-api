import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';

import { FirebaseService, GoogleOAuthService } from '../../../libs';
import { SignInPayload } from '../../../types';
import { EncryptionsUtil } from '../../encryptions/encryptions.util';
import { ProfileModel } from '../../models';
import { SignedDeviceModel } from '../../models/signed-device.model';
import { UserModel } from '../../models/user.model';
import { SignInWithFacebookDto } from '../dto/sign-in-with-facebook.dto';
import { CommonSignInService } from './common-sign-in.service';

@Injectable()
export class SignInFacebookService extends CommonSignInService {
  constructor(
    protected readonly encryptionsUtil: EncryptionsUtil,
    protected readonly firebaseService: FirebaseService,
    protected readonly userModel: UserModel,
    protected readonly signedDeviceModel: SignedDeviceModel,
    protected readonly googleOauthService: GoogleOAuthService,
    protected readonly profileModel: ProfileModel,
  ) {
    super(profileModel, userModel, signedDeviceModel, encryptionsUtil);
  }

  async getSignInPayload(
    payload: SignInWithFacebookDto,
  ): Promise<SignInPayload> {
    let facebookId: string | undefined;
    try {
      const { data: facebookResponse } = await axios.get<{ id?: string }>(
        `https://graph.facebook.com/v8.0/me?access_token=${payload.token}`,
      );
      this.logger.debug(`Received response from facebook: ${facebookResponse}`);
      facebookId = facebookResponse.id;
    } catch (err) {
      throw new BadRequestException();
    }
    return { facebookId };
  }
}
