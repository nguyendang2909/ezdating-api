import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInController } from './sign-in/sign-in.controller';
import { SignInInitService } from './sign-in/sign-in.init';
import { SignInFacebookService } from './sign-in/sign-in-facebook.service';
import { SignInGoogleService } from './sign-in/sign-in-google.service';
import { SignInPhoneNumberService } from './sign-in/sign-in-phone-number.service';
import { SignInPhoneNumberWithPasswordService } from './sign-in/sign-in-phone-number-with-password.service';
import { JwtStrategy } from './strategies/jwt-auth.strategy';

@Module({
  controllers: [SignInController, AuthController],
  providers: [
    JwtStrategy,
    AuthService,
    SignInInitService,
    SignInFacebookService,
    SignInGoogleService,
    SignInPhoneNumberService,
    SignInPhoneNumberWithPasswordService,
  ],
})
export class AuthModule {}
