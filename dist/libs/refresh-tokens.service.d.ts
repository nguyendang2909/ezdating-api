import { JwtService } from '@nestjs/jwt';
import { RefreshTokenPayload } from '../modules/auth/auth.type';
import { User } from '../modules/models';
export declare class RefreshTokensService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    SECRET_KEY: string;
    sign(payload: RefreshTokenPayload): string;
    signFromUser(user: User): string;
    verify(refreshToken: string): RefreshTokenPayload;
}
