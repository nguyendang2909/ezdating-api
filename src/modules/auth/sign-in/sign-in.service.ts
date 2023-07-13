import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import moment from 'moment';

import { HttpErrorCodes } from '../../../commons/erros/http-error-codes.constant';
import { EncryptionsUtil } from '../../encryptions/encryptions.util';
import { User } from '../../entities/entities/user.entity';
import { LoggedDeviceModel } from '../../entities/logged-device.model';
import { UserModel } from '../../entities/users.model';
import { UserRoles, UserStatuses } from '../../users/users.constant';
import { SignInData } from '../auth.type';
import { SignInWithPhoneNumberDto } from '../dto/sign-in-with-phone-number.dto';
import { SignInWithPhoneNumberAndPasswordDto } from '../dto/sign-in-with-phone-number-and-password.dto';
import { FirebaseService } from '../firebase.service';

@Injectable()
export class SignInService {
  constructor(
    private readonly encryptionsUtil: EncryptionsUtil,
    private readonly firebaseService: FirebaseService,
    private readonly userModel: UserModel,
    private readonly loggedDeviceModel: LoggedDeviceModel,
  ) {}

  private readonly logger = new Logger(SignInService.name);

  private async onApplicationBootstrap() {
    try {
      const phoneNumber = '+84971016191';
      const existAdminUser = await this.userModel.findOne({
        where: {
          phoneNumber,
        },
      });

      if (!existAdminUser && process.env.ADMIN_PASSWORD) {
        const adminUser = new User({
          phoneNumber,
          password: this.encryptionsUtil.hash(process.env.ADMIN_PASSWORD),
          nickname: 'Quynh',
          role: UserRoles.admin,
          status: UserStatuses.activated,
        });

        await this.userModel.saveOne(adminUser);
      }
    } catch (err) {
      this.logger.log(err);
    }
  }

  public async signInWithPhoneNumber(
    signInByPhoneNumberDto: SignInWithPhoneNumberDto,
  ): Promise<SignInData> {
    const { token } = signInByPhoneNumberDto;
    const decoded = await this.firebaseService.decodeToken(token);
    const phoneNumber = decoded.phone_number;
    if (!phoneNumber) {
      throw new NotFoundException({
        errorCode: HttpErrorCodes.USER_DOES_NOT_EXIST,
        message: 'User does not exist!',
      });
    }
    let user = await this.userModel.findOne({
      where: {
        phoneNumber,
      },
    });
    if (user) {
      const { status } = user;
      if (!status || status === UserStatuses.banned) {
        throw new ForbiddenException({
          statusCode: HttpErrorCodes.USER_HAS_BEEN_BANNED,
          message: 'You have been banned!',
        });
      }
    } else {
      user = await this.userModel.saveOne({
        phoneNumber,
      });
    }
    const { id: userId, role } = user;
    if (!userId || !role) {
      throw new NotFoundException({
        errorCode: HttpErrorCodes.USER_DOES_NOT_EXIST,
        message: 'User does not exist!',
      });
    }
    const accessToken = this.encryptionsUtil.signAccessToken({
      sub: userId,
      id: userId,
      role,
    });
    const refreshToken = this.encryptionsUtil.signRefreshToken({
      id: userId,
      sub: userId,
    });
    await this.loggedDeviceModel.saveOne(
      {
        user: {
          id: userId,
        },
        refreshToken: refreshToken,
        expiresIn: moment().add(100, 'days').toDate(),
      },
      userId,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  public async signInWithPhoneNumberAndPassword(
    signInByPhoneNumberWithPasswordDto: SignInWithPhoneNumberAndPasswordDto,
  ): Promise<SignInData> {
    const { phoneNumber, password } = signInByPhoneNumberWithPasswordDto;
    const {
      password: userPassword,
      id: userId,
      role: userRole,
    } = await this.userModel.findOneOrFail({
      where: {
        phoneNumber,
      },
    });
    if (!userPassword) {
      throw new BadRequestException('Try login with OTP!');
    }
    const isMatchPassword = this.encryptionsUtil.isMatchWithHashedKey(
      password,
      userPassword,
    );
    if (!isMatchPassword) {
      throw new UnauthorizedException({
        errorCode: 'PASSWORD_IS_NOT_CORRECT',
        message: 'Phone number or password is not correct!',
      });
    }
    const accessToken = this.encryptionsUtil.signAccessToken({
      id: userId,
      sub: userId,
      role: userRole,
    });
    const refreshToken = this.encryptionsUtil.signRefreshToken({
      id: userId,
      sub: userId,
    });
    await this.loggedDeviceModel.saveOne(
      {
        user: {
          id: userId,
        },
        refreshToken: refreshToken,
        expiresIn: moment().add(100, 'days').toDate(),
      },
      userId,
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
