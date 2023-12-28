/// <reference types="multer" />
import mongoose from 'mongoose';
import { ApiWriteService } from '../../../commons';
import { FilesService } from '../../../libs';
import { ProfilesUtil } from '../../../utils';
import { ClientData } from '../../auth/auth.type';
import { UploadPhotoDtoDto } from '../../media-files/dto/upload-photo.dto';
import { BasicProfile, BasicProfileModel, Profile, ProfileFilterModel, ProfileModel, StateModel, UserModel } from '../../models';
import { MongoConnection } from '../../models/mongo.connection';
import { MediaFile } from '../../models/schemas/media-file.schema';
import { CreateBasicProfileDto } from '../dto';
export declare class BasicProfileWriteService extends ApiWriteService<BasicProfile | Profile, CreateBasicProfileDto> {
    protected readonly basicProfileModel: BasicProfileModel;
    protected readonly profileModel: ProfileModel;
    protected readonly profileFilterModel: ProfileFilterModel;
    protected readonly stateModel: StateModel;
    protected readonly profilesUtil: ProfilesUtil;
    private readonly mongoConnection;
    private readonly userModel;
    private readonly filesService;
    constructor(basicProfileModel: BasicProfileModel, profileModel: ProfileModel, profileFilterModel: ProfileFilterModel, stateModel: StateModel, profilesUtil: ProfilesUtil, mongoConnection: MongoConnection, userModel: UserModel, filesService: FilesService);
    createOne(payload: CreateBasicProfileDto, client: ClientData): Promise<BasicProfile>;
    createProfile(basicProfile: BasicProfile, mediaFile: MediaFile): Promise<void>;
    uploadPhoto(file: Express.Multer.File, payload: UploadPhotoDtoDto, client: ClientData): Promise<mongoose.FlattenMaps<mongoose.Document<unknown, {}, MediaFile> & MediaFile & Required<{
        _id: mongoose.Types.ObjectId;
    }>>>;
    findOneOrFailById(id: string, _client: ClientData): Promise<Profile>;
    tryFindProfileAndBasicProfile(_currentUserId: mongoose.Types.ObjectId): Promise<{
        profile: Profile | null;
        basicProfile: BasicProfile | null;
    }>;
}
