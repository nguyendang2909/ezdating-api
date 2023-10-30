import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import axios from 'axios';
import moment from 'moment';
import { Types } from 'mongoose';

import { APP_CONFIG } from '../../../app.config';
import { HttpErrorMessages } from '../../../commons/erros/http-error-messages.constant';
import { USER_ROLES, USER_STATUSES } from '../../../constants';
import { FirebaseService, GoogleOAuthService } from '../../../libs';
import { DevicePlatform, UserRole } from '../../../types';
import { EncryptionsUtil } from '../../encryptions/encryptions.util';
import { SignedDeviceModel } from '../../models/signed-device.model';
import { UserModel } from '../../models/user.model';
import { SignInData } from '../auth.type';
import { SignInWithGoogleDto } from '../dto';
import { SignInWithFacebookDto } from '../dto/sign-in-with-facebook.dto';
import { SignInWithPhoneNumberDto } from '../dto/sign-in-with-phone-number.dto';
import { SignInWithPhoneNumberAndPasswordDto } from '../dto/sign-in-with-phone-number-and-password.dto';

@Injectable()
export class SignInService {
  constructor(
    private readonly encryptionsUtil: EncryptionsUtil,
    private readonly firebaseService: FirebaseService,
    private readonly userModel: UserModel,
    private readonly signedDeviceModel: SignedDeviceModel,
    private readonly googleOauthService: GoogleOAuthService,
  ) {}

  private readonly logger = new Logger(SignInService.name);

  public async onApplicationBootstrap() {
    try {
      const phoneNumber = '+84971016191';
      const existAdminUser = await this.userModel.findOne({
        phoneNumber,
      });
      if (!existAdminUser && process.env.ADMIN_PASSWORD) {
        await this.userModel.createOne({
          phoneNumber,
          password: this.encryptionsUtil.hash(process.env.ADMIN_PASSWORD),
          role: USER_ROLES.ADMIN,
        });
      }
    } catch (err) {
      this.logger.log(JSON.stringify(err));
    }
  }

  public async signInWithPhoneNumber(
    payload: SignInWithPhoneNumberDto,
  ): Promise<SignInData> {
    const { token, deviceToken, devicePlatform } = payload;
    const decoded = await this.firebaseService.decodeToken(token);
    const phoneNumber = decoded.phone_number;
    if (!phoneNumber) {
      throw new NotFoundException({
        message: HttpErrorMessages['User does not exist'],
      });
    }
    let user = await this.userModel.findOne({ phoneNumber });
    if (user) {
      const { status } = user;
      if (!status || status === USER_STATUSES.BANNED) {
        throw new ForbiddenException({
          message: HttpErrorMessages['You have been banned'],
        });
      }
      // TODO: If user is deactivated => activate user
    } else {
      user = await this.userModel.createOne({
        phoneNumber,
      });
    }
    const { accessToken, refreshToken } = this.createTokens(
      user._id.toString(),
      user.role,
    );
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

  public async signInWithPhoneNumberAndPassword(
    payload: SignInWithPhoneNumberAndPasswordDto,
  ): Promise<SignInData> {
    const { phoneNumber, password } = payload;
    const user = await this.userModel.findOneOrFail({ phoneNumber });
    if (!user.password) {
      throw new BadRequestException('Try login with OTP!');
    }
    this.encryptionsUtil.verifyMatchPassword(password, user.password);
    const { accessToken, refreshToken } = this.createTokens(
      user._id.toString(),
      user.role,
    );
    await this.createSession({
      _userId: user._id,
      refreshToken,
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  async signInWithGoogle(payload: SignInWithGoogleDto) {
    const { token: idToken, deviceToken, devicePlatform } = payload;
    const loginTicket = await this.googleOauthService.oauthClient.verifyIdToken(
      { idToken },
    );
    const loginTicketPayload = loginTicket.getPayload();
    if (!loginTicketPayload) {
      throw new BadRequestException();
    }
    const { email } = loginTicketPayload;
    let user = await this.userModel.findOne({ email });
    if (user) {
      const { status } = user;
      if (!status || status === USER_STATUSES.BANNED) {
        throw new ForbiddenException({
          message: HttpErrorMessages['You have been banned'],
        });
      }
      // TODO: If user is deactivated => activate user
    } else {
      user = await this.userModel.createOne({
        email,
      });
    }
    const { accessToken, refreshToken } = this.createTokens(
      user._id.toString(),
      user.role,
    );
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

  async loginByFacebook(payload: SignInWithFacebookDto) {
    let facebookId: string;
    try {
      const { data: facebookResponse } = await axios.get<{ id?: string }>(
        `https://graph.facebook.com/v8.0/me?access_token=${payload.token}`,
      );
      this.logger.debug(`Received response from facebook: ${facebookResponse}`);
      const { id } = facebookResponse;
      if (!id) {
        throw new BadRequestException();
      }
      facebookId = id;
    } catch (err) {
      throw new BadRequestException();
    }
    let user = await this.userModel.findOne({ facebookId });
    if (user) {
      const { status } = user;
      if (!status || status === USER_STATUSES.BANNED) {
        throw new ForbiddenException({
          message: HttpErrorMessages['You have been banned'],
        });
      }
      // TODO: If user is deactivated => activate user
    } else {
      user = await this.userModel.createOne({
        facebookId,
      });
    }
    const { accessToken, refreshToken } = this.createTokens(
      user._id.toString(),
      user.role,
    );
    await this.createSession({
      _userId: user._id,
      refreshToken,
      deviceToken: payload.deviceToken,
      devicePlatform: payload.devicePlatform,
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  async createSession({
    _userId,
    refreshToken,
    deviceToken,
    devicePlatform,
  }: {
    _userId: Types.ObjectId;
    devicePlatform?: DevicePlatform;
    deviceToken?: string;
    refreshToken: string;
  }) {
    await this.signedDeviceModel.createOne({
      _userId,
      refreshToken: refreshToken,
      expiresIn: moment()
        .add(APP_CONFIG.REFRESH_TOKEN_EXPIRES, 'days')
        .toDate(),
      ...(deviceToken && devicePlatform
        ? { token: deviceToken, platform: devicePlatform }
        : {}),
    });
  }

  createTokens(userId: string, role: UserRole) {
    const accessToken = this.encryptionsUtil.signAccessToken({
      sub: userId,
      id: userId,
      role,
    });
    const refreshToken = this.encryptionsUtil.signRefreshToken({
      id: userId,
      sub: userId,
    });

    return { accessToken, refreshToken };
  }
}
