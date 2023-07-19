import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserModel } from '../../entities/users.model';
import { AccessTokenPayload } from '../auth.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userModel: UserModel) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate(accessTokenPayload: AccessTokenPayload) {
    const user = await this.userModel
      .findOneOrFailById(accessTokenPayload.id)
      .catch(() => {
        throw new UnauthorizedException();
      });

    await this.userModel.updateOneById(user.id, {
      lastActivatedAt: new Date(),
    });

    return user;
  }
}
