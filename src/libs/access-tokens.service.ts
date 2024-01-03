import { Injectable } from '@nestjs/common';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';

import { AccessTokenSignPayload, ClientData } from '../modules/auth/auth.type';
import { User } from '../modules/models';

@Injectable()
export class AccessTokensService {
  constructor(private readonly jwtService: JwtService) {}

  public sign(authJwtPayload: AccessTokenSignPayload): string {
    return this.jwtService.sign(authJwtPayload);
  }

  public signFromUser(user: User): string {
    const userId = user._id.toString();
    return this.sign({
      id: userId,
      role: user.role,
      sub: userId,
      haveProfile: user.haveProfile,
    });
  }

  public verify(
    jwt: string,
    options?: Omit<JwtVerifyOptions, 'secret'>,
  ): ClientData {
    return this.jwtService.verify<ClientData>(jwt, options);
  }
}
