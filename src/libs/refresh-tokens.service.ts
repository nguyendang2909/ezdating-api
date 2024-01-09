import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { RefreshTokenPayload } from '../api/auth/auth.type';
import { User } from '../api/models';
import { APP_CONFIG } from '../app.config';

@Injectable()
export class RefreshTokensService {
  constructor(private readonly jwtService: JwtService) {}

  SECRET_KEY = process.env.JWT_REFRESH_TOKEN_SECRET_KEY;

  public sign(payload: RefreshTokenPayload): string {
    return this.jwtService.sign(payload, {
      expiresIn: `${APP_CONFIG.REFRESH_TOKEN_EXPIRES_AS_DAYS}d`,
      secret: this.SECRET_KEY,
    });
  }

  public signFromUser(user: User): string {
    const userId = user._id.toString();
    return this.sign({
      id: userId,
      sub: userId,
    });
  }

  public verify(refreshToken: string): RefreshTokenPayload {
    return this.jwtService.verify<RefreshTokenPayload>(refreshToken, {
      secret: this.SECRET_KEY,
    });
  }
}
