import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { APP_CONFIG } from '../../app.config';
import { EncryptionsUtil } from './encryptions.util';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: {
        expiresIn: APP_CONFIG.ACCESS_TOKEN_EXPIRES,
      },
    }),
  ],
  exports: [EncryptionsUtil],
  providers: [EncryptionsUtil],
})
export class EncryptionsModule {}
