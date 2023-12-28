import { Logger } from '@nestjs/common';
import mongoose from 'mongoose';
import { ApiBaseService } from '../../../commons';
import { AccessTokensService, RefreshTokensService } from '../../../libs';
import { SignInPayload, SignInPayloadWithToken } from '../../../types';
import { ProfileModel, SignedDeviceModel, User, UserModel } from '../../models';
import { SignInData } from '../auth.type';
import { SignInDto } from '../dto';
export declare class CommonSignInService extends ApiBaseService {
    protected readonly userModel: UserModel;
    protected readonly profileModel: ProfileModel;
    protected readonly signedDeviceModel: SignedDeviceModel;
    protected readonly accessTokensService: AccessTokensService;
    protected readonly refreshTokensService: RefreshTokensService;
    constructor(userModel: UserModel, profileModel: ProfileModel, signedDeviceModel: SignedDeviceModel, accessTokensService: AccessTokensService, refreshTokensService: RefreshTokensService);
    protected readonly logger: Logger;
    signIn(payload: SignInDto): Promise<SignInData>;
    getSignInPayload(payload: SignInDto): Promise<SignInPayload>;
    getTokensFromSignInPayload(payload: SignInPayloadWithToken): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    createTokens(user: User): {
        accessToken: string;
        refreshToken: string;
    };
    createSession({ _userId, refreshToken, deviceToken, devicePlatform, }: {
        _userId: mongoose.Types.ObjectId;
        refreshToken: string;
    } & SignInDto): Promise<import("../../models").SignedDevice | null>;
}
