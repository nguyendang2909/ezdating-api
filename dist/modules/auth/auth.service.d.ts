import { ApiService } from '../../commons/services/api.service';
import { AccessTokensService, RefreshTokensService } from '../../libs';
import { SignedDeviceModel } from '../models/signed-device.model';
import { UserModel } from '../models/user.model';
import { LogoutDto } from './dto/logout.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
export declare class AuthService extends ApiService {
    private readonly signedDeviceModel;
    private readonly userModel;
    private readonly refreshTokensService;
    private readonly accessTokensService;
    constructor(signedDeviceModel: SignedDeviceModel, userModel: UserModel, refreshTokensService: RefreshTokensService, accessTokensService: AccessTokensService);
    logout(payload: LogoutDto): Promise<void>;
    refreshAccessToken(payload: RefreshTokenDto): Promise<{
        accessToken: string;
    }>;
    refreshToken(payload: RefreshTokenDto): Promise<{
        refreshToken: string;
    }>;
}
