import { AccessTokensService } from '../../../libs';
import { UserModel } from '../../models';
import { AdminLoginDto } from './dto';
export declare class AdminAuthService {
    private readonly userModel;
    private readonly accessTokensService;
    constructor(userModel: UserModel, accessTokensService: AccessTokensService);
    login(payload: AdminLoginDto): Promise<{
        accessToken: string;
    }>;
}
