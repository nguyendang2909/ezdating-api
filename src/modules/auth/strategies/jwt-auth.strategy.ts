import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserStatuses } from '../../users/users.constant';
import { UserEntity } from '../../users/users-entity.service';
import { AuthJwtPayload } from '../auth.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userEntity: UserEntity) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate(jwtPayload: AuthJwtPayload) {
    const user = await this.userEntity.findOneById(jwtPayload.id);
    if (!user) {
      throw new BadRequestException({
        errorCode: 'USER_DOES_NOT_EXIST',
        message: "User doesn't exist!",
      });
    }
    const { status } = user;
    if (!status || status === UserStatuses.banned) {
      throw new ForbiddenException({
        message: 'User has been banned',
        errorCode: 'USER_BANNED',
      });
    }
    await this.userEntity.updateOneById(user.id, {
      lastActivatedAt: new Date(),
    });

    return user;
  }
}
