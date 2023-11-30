import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

import { APP_CONFIG } from '../../app.config';
import {
  AccessTokenSignPayload,
  ClientData,
  RefreshTokenPayload,
} from '../auth/auth.type';
import { User } from '../models';

@Injectable()
export class EncryptionsUtil {
  constructor(private readonly jwtService: JwtService) {}

  private readonly JWT_REFRESH_TOKEN_SECRET_KEY =
    process.env.JWT_REFRESH_TOKEN_SECRET_KEY;

  private hashSecretKey = process.env.HASH_SECRET_KEY;

  public signAccessToken(authJwtPayload: AccessTokenSignPayload): string {
    return this.jwtService.sign(authJwtPayload);
  }

  public signAccessTokenFromUser(user: User): string {
    const userId = user._id.toString();
    return this.signAccessToken({
      id: userId,
      role: user.role,
      sub: userId,
      haveProfile: user.haveProfile,
    });
  }

  public signRefreshToken(payload: RefreshTokenPayload): string {
    return this.jwtService.sign(payload, {
      expiresIn: `${APP_CONFIG.REFRESH_TOKEN_EXPIRES_AS_DAYS}d`,
      secret: this.JWT_REFRESH_TOKEN_SECRET_KEY,
    });
  }

  public signRefreshTokenFromUser(user: User): string {
    const userId = user._id.toString();
    return this.signRefreshToken({
      id: userId,
      sub: userId,
    });
  }

  public verifyAccessToken(
    jwt: string,
    options?: Omit<JwtVerifyOptions, 'secret'>,
  ): ClientData {
    return this.jwtService.verify<ClientData>(jwt, options);
  }

  public verifyRefreshToken(
    refreshToken: string,
    options?: Omit<JwtVerifyOptions, 'secret'>,
  ): RefreshTokenPayload {
    return this.jwtService.verify<RefreshTokenPayload>(refreshToken, {
      ...(options ? options : {}),
      secret: this.JWT_REFRESH_TOKEN_SECRET_KEY,
    });
  }

  public hash(key: string): string {
    return bcrypt.hashSync(key + this.hashSecretKey, 10);
  }

  public isMatchWithHashedKey(key: string, hashedKey: string): boolean {
    return bcrypt.compareSync(`${key}${this.hashSecretKey}`, hashedKey);
  }

  public verifyMatchPassword(
    password: string,
    hashedPassword: string,
  ): boolean {
    const isMatchPassword = this.isMatchWithHashedKey(password, hashedPassword);
    if (!isMatchPassword) {
      throw new UnauthorizedException({
        errorCode: 'PASSWORD_IS_NOT_CORRECT',
        message: 'Password is not correct!',
      });
    }
    return isMatchPassword;
  }
}
