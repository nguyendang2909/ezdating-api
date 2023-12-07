import { AccessTokensService, GoogleOAuthService, RefreshTokensService } from '../../../libs';
import { SignInPayload } from '../../../types';
import { ProfileModel } from '../../models';
import { SignedDeviceModel } from '../../models/signed-device.model';
import { UserModel } from '../../models/user.model';
import { SignInWithGoogleDto } from '../dto';
import { CommonSignInService } from './common-sign-in.service';
export declare class SignInGoogleService extends CommonSignInService {
    protected readonly userModel: UserModel;
    protected readonly signedDeviceModel: SignedDeviceModel;
    protected readonly googleOauthService: GoogleOAuthService;
    protected readonly profileModel: ProfileModel;
    protected readonly accessTokensService: AccessTokensService;
    protected readonly refreshTokensService: RefreshTokensService;
    constructor(userModel: UserModel, signedDeviceModel: SignedDeviceModel, googleOauthService: GoogleOAuthService, profileModel: ProfileModel, accessTokensService: AccessTokensService, refreshTokensService: RefreshTokensService);
    getSignInPayload(payload: SignInWithGoogleDto): Promise<SignInPayload>;
}
