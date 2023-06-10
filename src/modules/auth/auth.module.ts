import { Module } from '@nestjs/common';

import { EncryptionsModule } from '../encryptions/encryptions.module';
import { UsersModule } from '../users/users.module';
import { FirebaseService } from './firebase.service';
import { SignInController } from './sign-in/sign-in.controller';
import { SignInService } from './sign-in/sign-in.service';
import { JwtStrategy } from './strategies/jwt-auth.strategy';

@Module({
  imports: [EncryptionsModule, UsersModule],
  controllers: [SignInController],
  providers: [JwtStrategy, SignInService, FirebaseService],
})
export class AuthModule {}
