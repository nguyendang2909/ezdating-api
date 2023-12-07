import { AccessTokensService, FirebaseService, PasswordsService, RefreshTokensService } from '../../../libs';
import { SignInPayload } from '../../../types';
import { ProfileModel, SignedDeviceModel, UserModel } from '../../models';
import { SignInWithPhoneNumberAndPasswordDto } from '../dto';
import { CommonSignInService } from './common-sign-in.service';
export declare class SignInPhoneNumberWithPasswordService extends CommonSignInService {
    protected readonly firebaseService: FirebaseService;
    protected readonly userModel: UserModel;
    protected readonly signedDeviceModel: SignedDeviceModel;
    protected readonly profileModel: ProfileModel;
    protected readonly accessTokensService: AccessTokensService;
    protected readonly refreshTokensService: RefreshTokensService;
    protected readonly passwordsService: PasswordsService;
    constructor(firebaseService: FirebaseService, userModel: UserModel, signedDeviceModel: SignedDeviceModel, profileModel: ProfileModel, accessTokensService: AccessTokensService, refreshTokensService: RefreshTokensService, passwordsService: PasswordsService);
    getSignInPayload(payload: SignInWithPhoneNumberAndPasswordDto): Promise<SignInPayload>;
}
