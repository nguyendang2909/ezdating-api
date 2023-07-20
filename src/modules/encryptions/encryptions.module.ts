import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { EncryptionsUtil } from './encryptions.util';
import { AppConfig } from '../../app.config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET_KEY'),
          signOptions: {
            expiresIn: AppConfig.ACCESS_TOKEN_EXPIRES,
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
