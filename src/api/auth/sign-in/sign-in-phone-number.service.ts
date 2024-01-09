import { Injectable } from '@nestjs/common';

import {
  AccessTokensService,
  FirebaseService,
  RefreshTokensService,
} from '../../../libs';
import { SignInPayload } from '../../../types';
import { ProfileModel, SignedDeviceModel, UserModel } from '../../models';
import { SignInWithPhoneNumberDto } from '../dto';
import { CommonSignInService } from './common-sign-in.service';

@Injectable()
export class SignInPhoneNumberService extends CommonSignInService {
  constructor(
    protected readonly profileModel: ProfileModel,
    protected readonly userModel: UserModel,
    protected readonly signedDeviceModel: SignedDeviceModel,
    protected readonly firebaseService: FirebaseService,
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

  async getSignInPayload(
    payload: SignInWithPhoneNumberDto,
  ): Promise<SignInPayload> {
    const decoded = await this.firebaseService.decodeToken(payload.token);
    return { phoneNumber: decoded.phone_number };
  }
}
