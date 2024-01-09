import { BadRequestException, Injectable } from '@nestjs/common';

import {
  AccessTokensService,
  FirebaseService,
  PasswordsService,
  RefreshTokensService,
} from '../../../libs';
import { SignInPayload } from '../../../types';
import { ProfileModel, SignedDeviceModel, UserModel } from '../../models';
import { SignInWithPhoneNumberAndPasswordDto } from '../dto';
import { CommonSignInService } from './common-sign-in.service';

@Injectable()
export class SignInPhoneNumberWithPasswordService extends CommonSignInService {
  constructor(
    protected readonly firebaseService: FirebaseService,
    protected readonly userModel: UserModel,
    protected readonly signedDeviceModel: SignedDeviceModel,
    protected readonly profileModel: ProfileModel,
    protected readonly accessTokensService: AccessTokensService,
    protected readonly refreshTokensService: RefreshTokensService,
    protected readonly passwordsService: PasswordsService,
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
    payload: SignInWithPhoneNumberAndPasswordDto,
  ): Promise<SignInPayload> {
    const { phoneNumber, password } = payload;
    const user = await this.userModel.findOneOrFail({ phoneNumber });
    if (!user.password) {
      throw new BadRequestException('Try login with OTP!');
    }
    this.passwordsService.verifyCompare(password, user.password);
    return { phoneNumber };
  }
}
