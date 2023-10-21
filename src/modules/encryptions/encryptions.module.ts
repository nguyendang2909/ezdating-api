import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { APP_CONFIG } from '../../app.config';
import { EncryptionsUtil } from './encryptions.util';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET_KEY'),
          signOptions: {
            expiresIn: APP_CONFIG.ACCESS_TOKEN_EXPIRES,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [EncryptionsUtil],
  providers: [EncryptionsUtil],
})
export class EncryptionsModule {}
