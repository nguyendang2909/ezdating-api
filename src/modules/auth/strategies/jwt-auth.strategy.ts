import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserModel } from '../../models/user.model';
import { ClientData } from '../auth.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userModel: UserModel) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  validate(accessTokenPayload: ClientData) {
    this.userModel.updateOneById(
      this.userModel.getObjectId(accessTokenPayload.id),
      {
        $set: {
          lastActivatedAt: new Date(),
        },
      },
    );

    return accessTokenPayload;
  }
}
