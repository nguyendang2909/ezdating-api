import { BadRequestException, Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

import { AccessTokensService, RefreshTokensService } from '../../../libs';
import { ProfileModel } from '../../../models';
import { SignedDeviceModel } from '../../../models/signed-device.model';
import { UserModel } from '../../../models/user.model';
import { SignInPayload } from '../../../types';
import { SignInWithAppleDto } from '../dto/sign-in-with-apple.dto';
import { CommonSignInService } from './common-sign-in.service';

@Injectable()
export class SignInAppleService extends CommonSignInService {
  constructor(
    protected readonly userModel: UserModel,
    protected readonly signedDeviceModel: SignedDeviceModel,
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

  async getSignInPayload(payload: SignInWithAppleDto): Promise<SignInPayload> {
    const { token } = payload;
    const decodedJwt = jwt.decode(token, {
      complete: true,
    });
    if (!decodedJwt) {
      throw new BadRequestException();
    }
    const { header } = decodedJwt;
    const kid = header.kid;
    const publicKey = (await this.getKey(kid!)).getPublicKey();
    const { sub } = jwt.verify(token, publicKey);
    if (!sub) {
      throw new BadRequestException();
    }
    return { appleId: sub as string };
  }

  async getKey(kid: string) {
    const client = jwksClient({
      jwksUri: 'https://appleid.apple.com/auth/keys',
      timeout: 30000,
    });
    return await client.getSigningKey(kid);
  }
}
