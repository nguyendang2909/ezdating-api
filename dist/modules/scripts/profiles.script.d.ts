import { AxiosInstance } from 'axios';
import { AccessTokensService } from '../../libs';
import { EmbeddedMediaFile, ProfileFilterModel, ProfileModel, StateModel, UserModel } from '../models';
import { ApiScript } from './api.script';
export declare class ProfilesScript {
    private readonly profileModel;
    private readonly userModel;
    private readonly acessTokensService;
    private readonly apiScript;
    private readonly stateModel;
    private readonly profileFilterModel;
    baseUrl: string;
    api: AxiosInstance;
    constructor(profileModel: ProfileModel, userModel: UserModel, acessTokensService: AccessTokensService, apiScript: ApiScript, stateModel: StateModel, profileFilterModel: ProfileFilterModel);
    private logger;
    onApplicationBootstrap(): void;
    createProfilesFemale(): Promise<void>;
    getSampleData(): Promise<{
        mediaFiles: EmbeddedMediaFile[];
    }>;
    getRandomMediaFiles(mediaFiles: EmbeddedMediaFile[]): EmbeddedMediaFile[];
}
