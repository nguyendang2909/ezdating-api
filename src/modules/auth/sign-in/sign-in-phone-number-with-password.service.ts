import { BadRequestException, Injectable } from '@nestjs/common';

import { FirebaseService } from '../../../libs';
import { SignInPayload } from '../../../types';
import { EncryptionsUtil } from '../../encryptions/encryptions.util';
import { ProfileModel, SignedDeviceModel, UserModel } from '../../models';
import { SignInWithPhoneNumberAndPasswordDto } from '../dto';
import { CommonSignInService } from './common-sign-in.service';

@Injectable()
export class SignInPhoneNumberWithPasswordService extends CommonSignInService {
  constructor(
    protected readonly profileModel: ProfileModel,
    protected readonly userModel: UserModel,
    protected readonly signedDeviceModel: SignedDeviceModel,
    protected readonly encryptionsUtil: EncryptionsUtil,
    private readonly firebaseService: FirebaseService,
  ) {
    super(profileModel, userModel, signedDeviceModel, encryptionsUtil);
  }

  async getSignInPayload(
    payload: SignInWithPhoneNumberAndPasswordDto,
  ): Promise<SignInPayload> {
    const { phoneNumber, password } = payload;
    const user = await this.userModel.findOneOrFail({ phoneNumber });
    if (!user.password) {
      throw new BadRequestException('Try login with OTP!');
    }
    this.encryptionsUtil.verifyMatchPassword(password, user.password);
    return { phoneNumber };
  }
}
