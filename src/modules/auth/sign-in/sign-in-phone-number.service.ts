import { Injectable } from '@nestjs/common';

import { FirebaseService } from '../../../libs';
import { SignInPayload } from '../../../types';
import { EncryptionsUtil } from '../../encryptions/encryptions.util';
import { ProfileModel, SignedDeviceModel, UserModel } from '../../models';
import { SignInWithPhoneNumberDto } from '../dto';
import { CommonSignInService } from './common-sign-in.service';

@Injectable()
export class SignInPhoneNumberService extends CommonSignInService {
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
    payload: SignInWithPhoneNumberDto,
  ): Promise<SignInPayload> {
    const decoded = await this.firebaseService.decodeToken(payload.token);
    return { phoneNumber: decoded.phone_number };
  }
}
