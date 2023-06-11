import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { EncryptionsUtil } from '../../encryptions/encryptions.util';
import { UsersAuthUtil } from '../../users/auth-users.util';
import { EUserStatus } from '../../users/users.constant';
import { SignInData } from '../auth.type';
import { SignInWithPhoneNumberDto } from '../dto/sign-in-with-phone-number.dto';
import { SignInWithPhoneNumberAndPasswordDto } from '../dto/sign-in-with-phone-number-and-password.dto';
import { FirebaseService } from '../firebase.service';

@Injectable()
export class SignInService {
  constructor(
    private readonly usersAuthUtil: UsersAuthUtil,
    private readonly encryptionsUtil: EncryptionsUtil,
    private readonly firebaseService: FirebaseService,
  ) {}

  public async signInWithPhoneNumber(
    signInByPhoneNumberDto: SignInWithPhoneNumberDto,
  ): Promise<SignInData> {
    const { token } = signInByPhoneNumberDto;
    const decoded = await this.firebaseService.decodeToken(token);
    const phoneNumber = decoded.phone_number;
    if (!phoneNumber) {
      throw new BadRequestException('Token is invalid!');
    }
    let user = await this.usersAuthUtil.findOne(
      { phoneNumber },
      {
        selects: ['status', 'role'],
      },
    );
    if (user) {
      const { status } = user;
      if (status && status === EUserStatus.banned) {
        throw new ForbiddenException('You have been banned!');
      }
    } else {
      user = await this.usersAuthUtil.create({
        phoneNumber,
      });
    }
    const { id, role } = user;
    if (!id || !role) {
      throw new BadRequestException('User is not correct!');
    }

    return {
      accessToken: this.encryptionsUtil.signJwt({
        sub: id,
        id,
        role,
      }),
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
    } = await this.usersAuthUtil.findOneOrFail(
      { phoneNumber },
      { selects: ['password', 'id', 'role'] },
    );
    if (!userId || !userPassword || !userRole) {
      throw new BadRequestException('Try login with OTP!');
    }
    const isMatchPassword = this.encryptionsUtil.isMatchWithHashedKey(
      password,
      userPassword,
    );
    if (!isMatchPassword) {
      throw new UnauthorizedException(
        'Phone number or password is not correct!',
      );
    }

    return {
      accessToken: this.encryptionsUtil.signJwt({
        id: userId,
        sub: userId,
        role: userRole,
      }),
    };
  }
}
