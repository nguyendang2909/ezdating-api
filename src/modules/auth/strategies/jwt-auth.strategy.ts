import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UsersAuthUtil } from '../../users/auth-users.util';
import { AuthJwtPayload } from '../auth.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private usersAuthUtil: UsersAuthUtil) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate(jwtPayload: AuthJwtPayload) {
    const user = await this.usersAuthUtil.findOneById(jwtPayload.id);

    return user;
  }
}
