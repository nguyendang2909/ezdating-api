import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

import { AuthJwtPayload, AuthJwtSignPayload } from '../auth/auth.type';

@Injectable()
export class EncryptionsUtil {
  constructor(private readonly jwtService: JwtService) {}

  private hashSecretKey = process.env.HASH_SECRET_KEY;

  public signJwt(authJwtPayload: AuthJwtSignPayload): string {
    return this.jwtService.sign(authJwtPayload);
  }

  public verifyJwt(jwt: string): AuthJwtPayload {
    return this.jwtService.verify<AuthJwtPayload>(jwt);
  }

  public hash(key: string): string {
    return bcrypt.hashSync(key + this.hashSecretKey, 10);
  }

  public isMatchWithHashedKey(key: string, hashedKey: string): boolean {
    return bcrypt.compareSync(`${key}${this.hashSecretKey}`, hashedKey);
  }
}
