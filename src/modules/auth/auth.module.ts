import { Module } from '@nestjs/common';

import { LoggedDevicesModule } from '../logged-devices/logged-devices.module';
import { EncryptionsModule } from '../encryptions/encryptions.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FirebaseService } from './firebase.service';
import { SignInController } from './sign-in/sign-in.controller';
import { SignInService } from './sign-in/sign-in.service';
import { JwtStrategy } from './strategies/jwt-auth.strategy';

@Module({
  imports: [EncryptionsModule, UsersModule, LoggedDevicesModule],
  controllers: [SignInController, AuthController],
  providers: [JwtStrategy, SignInService, FirebaseService, AuthService],
})
export class AuthModule {}
