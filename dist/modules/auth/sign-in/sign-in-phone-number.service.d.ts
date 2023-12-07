import { AccessTokensService, FirebaseService, RefreshTokensService } from '../../../libs';
import { SignInPayload } from '../../../types';
import { ProfileModel, SignedDeviceModel, UserModel } from '../../models';
import { SignInWithPhoneNumberDto } from '../dto';
import { CommonSignInService } from './common-sign-in.service';
export declare class SignInPhoneNumberService extends CommonSignInService {
    protected readonly profileModel: ProfileModel;
    protected readonly userModel: UserModel;
    protected readonly signedDeviceModel: SignedDeviceModel;
    protected readonly firebaseService: FirebaseService;
    protected readonly accessTokensService: AccessTokensService;
    protected readonly refreshTokensService: RefreshTokensService;
    constructor(profileModel: ProfileModel, userModel: UserModel, signedDeviceModel: SignedDeviceModel, firebaseService: FirebaseService, accessTokensService: AccessTokensService, refreshTokensService: RefreshTokensService);
    getSignInPayload(payload: SignInWithPhoneNumberDto): Promise<SignInPayload>;
}
