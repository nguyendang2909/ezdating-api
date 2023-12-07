import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { CommonTokensService } from '../commons/services/common-token.service';
import { AccessTokenSignPayload, ClientData } from '../modules/auth/auth.type';
import { User } from '../modules/models';
export declare class AccessTokensService extends CommonTokensService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    sign(authJwtPayload: AccessTokenSignPayload): string;
    signFromUser(user: User): string;
    verify(jwt: string, options?: Omit<JwtVerifyOptions, 'secret'>): ClientData;
}
