/// <reference types="multer" />
import { Logger } from '@nestjs/common';
import mongoose from 'mongoose';
import { FilesService } from '../../libs';
import { ClientData } from '../auth/auth.type';
import { UploadPhotoDtoDto } from '../media-files/dto/upload-photo.dto';
import { BasicProfile, BasicProfileModel, MediaFileModel, Profile, ProfileFilterModel, ProfileModel, StateModel, UserModel } from '../models';
import { MongoConnection } from '../models/mongo.connection';
import { MediaFile } from '../models/schemas/media-file.schema';
import { CreateBasicProfileDto } from './dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { ProfilesCommonService } from './profiles.common.service';
export declare class ProfilesService extends ProfilesCommonService {
    private readonly profileModel;
    private readonly profileFilterModel;
    private readonly stateModel;
    private readonly basicProfileModel;
    private readonly filesService;
    private readonly mediaFileModel;
    private readonly userModel;
    private readonly mongoConnection;
    constructor(profileModel: ProfileModel, profileFilterModel: ProfileFilterModel, stateModel: StateModel, basicProfileModel: BasicProfileModel, filesService: FilesService, mediaFileModel: MediaFileModel, userModel: UserModel, mongoConnection: MongoConnection);
    logger: Logger;
    createBasic(payload: CreateBasicProfileDto, client: ClientData): Promise<BasicProfile>;
    createProfile(basicProfile: BasicProfile, mediaFile: MediaFile): Promise<void>;
    uploadBasicPhoto(file: Express.Multer.File, payload: UploadPhotoDtoDto, client: ClientData): Promise<mongoose.FlattenMaps<mongoose.Document<unknown, {}, MediaFile> & MediaFile & Required<{
        _id: mongoose.Types.ObjectId;
    }>>>;
    getMe(clientData: ClientData): Promise<Profile | BasicProfile>;
    findOneOrFailById(id: string, _client: ClientData): Promise<Profile>;
    updateMe(payload: UpdateMyProfileDto, client: ClientData): Promise<void>;
    tryFindProfileAndBasicProfile(_currentUserId: mongoose.Types.ObjectId): Promise<{
        profile: Profile | null;
        basicProfile: BasicProfile | null;
    }>;
}
