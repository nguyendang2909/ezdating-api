import { AccessTokensService, RefreshTokensService } from '../../../libs';
import { SignInPayload } from '../../../types';
import { ProfileModel } from '../../models';
import { SignedDeviceModel } from '../../models/signed-device.model';
import { UserModel } from '../../models/user.model';
import { SignInWithFacebookDto } from '../dto/sign-in-with-facebook.dto';
import { CommonSignInService } from './common-sign-in.service';
export declare class SignInFacebookService extends CommonSignInService {
    protected readonly userModel: UserModel;
    protected readonly signedDeviceModel: SignedDeviceModel;
    protected readonly profileModel: ProfileModel;
    protected readonly accessTokensService: AccessTokensService;
    protected readonly refreshTokensService: RefreshTokensService;
    constructor(userModel: UserModel, signedDeviceModel: SignedDeviceModel, profileModel: ProfileModel, accessTokensService: AccessTokensService, refreshTokensService: RefreshTokensService);
    getSignInPayload(payload: SignInWithFacebookDto): Promise<SignInPayload>;
}
