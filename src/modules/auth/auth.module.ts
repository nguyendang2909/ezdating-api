import { Module } from '@nestjs/common';

import { EncryptionsModule } from '../encryptions/encryptions.module';
import { ModelsModule } from '../models/models.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FirebaseService } from './firebase.service';
import { SignInController } from './sign-in/sign-in.controller';
import { SignInService } from './sign-in/sign-in.service';
import { JwtStrategy } from './strategies/jwt-auth.strategy';

@Module({
  imports: [EncryptionsModule, ModelsModule],
  controllers: [SignInController, AuthController],
  providers: [JwtStrategy, SignInService, FirebaseService, AuthService],
})
export class AuthModule {}
