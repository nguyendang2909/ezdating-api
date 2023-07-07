import { Injectable } from '@nestjs/common';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

import {
  AuthJwtPayload,
  AuthJwtSignPayload,
  AuthRefreshTokenPayload,
  AuthRefreshTokenSignPayload,
} from '../auth/auth.type';

@Injectable()
export class EncryptionsUtil {
  constructor(private readonly jwtService: JwtService) {}

  private readonly REFRESH_TOKEN_SECRET_KEY =
    process.env.REFRESH_TOKEN_SECRET_KEY;

  private hashSecretKey = process.env.HASH_SECRET_KEY;

  public signAccessToken(authJwtPayload: AuthJwtSignPayload): string {
    return this.jwtService.sign(authJwtPayload);
  }

  public signRefreshToken(payload: AuthRefreshTokenPayload): string {
    return this.jwtService.sign(payload, {
      expiresIn: '100d',
      secret: this.REFRESH_TOKEN_SECRET_KEY,
    });
  }

  public verifyJwt(jwt: string, options?: JwtVerifyOptions): AuthJwtPayload {
    return this.jwtService.verify<AuthJwtPayload>(jwt, options);
  }

  public verifyRefreshToken(
    refreshToken: string,
    options?: Omit<JwtVerifyOptions, 'secret'>,
  ): AuthRefreshTokenSignPayload {
    return this.jwtService.verify<AuthRefreshTokenSignPayload>(refreshToken, {
      ...(options ? options : {}),
      secret: this.REFRESH_TOKEN_SECRET_KEY,
    });
  }

  public hash(key: string): string {
    return bcrypt.hashSync(key + this.hashSecretKey, 10);
  }

  public isMatchWithHashedKey(key: string, hashedKey: string): boolean {
    return bcrypt.compareSync(`${key}${this.hashSecretKey}`, hashedKey);
  }
}
