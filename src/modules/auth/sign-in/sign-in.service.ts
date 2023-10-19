import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import moment from 'moment';

import { APP_CONFIG } from '../../../app.config';
import { UserRoles, UserStatuses } from '../../../commons/constants';
import { HttpErrorMessages } from '../../../commons/erros/http-error-messages.constant';
import { EncryptionsUtil } from '../../encryptions/encryptions.util';
import { FirebaseService } from '../../firebase/firebase.service';
import { SignedDeviceModel } from '../../models/signed-device.model';
import { UserModel } from '../../models/user.model';
import { SignInData } from '../auth.type';
import { SignInWithPhoneNumberDto } from '../dto/sign-in-with-phone-number.dto';
import { SignInWithPhoneNumberAndPasswordDto } from '../dto/sign-in-with-phone-number-and-password.dto';

@Injectable()
export class SignInService {
  constructor(
    private readonly encryptionsUtil: EncryptionsUtil,
    private readonly firebaseService: FirebaseService,
    private readonly userModel: UserModel,
    private readonly signedDeviceModel: SignedDeviceModel,
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
          nickname: 'Quynh',
          role: UserRoles.admin,
        });
      }
    } catch (err) {
      this.logger.log(err);
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
        message: HttpErrorMessages['User does not exist.'],
      });
    }
    let user = await this.userModel.findOne({ phoneNumber });
    if (user) {
      const { status } = user;
      if (!status || status === UserStatuses.banned) {
        throw new ForbiddenException({
          message: HttpErrorMessages['You have been banned.'],
        });
      }
      // TODO: If user is deactivated => activate user
    } else {
      user = (
        await this.userModel.createOne({
          phoneNumber,
        })
      ).toJSON();
    }
    const { _id: _userId, role, gender } = user;
    if (!_userId || !role) {
      throw new NotFoundException({
        message: 'User data is incorrect!',
      });
    }
    const userId = _userId.toString();
    const accessToken = this.encryptionsUtil.signAccessToken({
      sub: userId,
      id: userId,
      role,
      gender,
    });
    const refreshToken = this.encryptionsUtil.signRefreshToken({
      id: userId,
      sub: userId,
    });
    await this.signedDeviceModel.createOne({
      _userId,
      refreshToken: refreshToken,
      expiresIn: moment()
        .add(APP_CONFIG.REFRESH_TOKEN_EXPIRES, 'days')
        .toDate(),
      ...(deviceToken && devicePlatform
        ? { token, platform: devicePlatform }
        : {}),
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
    const {
      password: hashedPassword,
      _id: _userId,
      role: userRole,
      gender,
    } = await this.userModel.findOneOrFail({ phoneNumber });
    if (!hashedPassword || !_userId || !userRole) {
      throw new BadRequestException('Try login with OTP!');
    }
    this.encryptionsUtil.verifyMatchPassword(password, hashedPassword);
    const userId = _userId.toString();
    const accessToken = this.encryptionsUtil.signAccessToken({
      id: userId,
      sub: userId,
      role: userRole,
      gender,
    });
    const refreshToken = this.encryptionsUtil.signRefreshToken({
      id: userId,
      sub: userId,
    });
    await this.signedDeviceModel.createOne({
      _userId,
      refreshToken: refreshToken,
      expiresIn: moment().add(100, 'days').toDate(),
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
