import { Logger } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { ApiRequest, Gender } from '../../types';
import { Profile, ProfileModel, UserModel } from '../models';
import { ProfilesCommonService } from '../profiles/base/profiles.common.service';
export declare class ApiScript extends ProfilesCommonService {
    private readonly profileModel;
    private readonly userModel;
    baseUrl: string;
    api: AxiosInstance;
    constructor(profileModel: ProfileModel, userModel: UserModel);
    init(accessToken: string): AxiosInstance;
    logger: Logger;
    createProfile(options?: {
        gender?: Gender;
    }): Promise<{
        data: Profile;
    }>;
    updateProfile(): Promise<void>;
    sendLike(body: ApiRequest.SendLike): Promise<import("axios").AxiosResponse<void, any>>;
}
