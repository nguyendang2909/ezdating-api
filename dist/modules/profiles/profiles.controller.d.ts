/// <reference types="multer" />
/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import { PaginatedResponse } from '../../types';
import { ClientData } from '../auth/auth.type';
import { UploadPhotoDtoDto } from '../media-files/dto/upload-photo.dto';
import { Profile } from '../models';
import { CreateBasicProfileDto, FindManyNearbyProfilesQuery, FindManySwipeProfilesQuery } from './dto';
import { BasicProfileWriteService } from './services/basic-profile-write.service';
import { NearbyProfilesService } from './services/nearby-profiles.service';
import { ProfilesReadService } from './services/profiles-read.service';
import { ProfilesReadMeService } from './services/profiles-read-me.service';
import { ProfilesWriteMeService } from './services/profiles-write-me.service';
import { SwipeProfilesService } from './services/swipe-profiles.service';
export declare class ProfilesController {
    private readonly readMeService;
    private readonly basicProfileWriteService;
    private readonly writeMeService;
    private readonly swipeProfilesService;
    private readonly nearbyProfilesService;
    private readonly profilesReadService;
    constructor(readMeService: ProfilesReadMeService, basicProfileWriteService: BasicProfileWriteService, writeMeService: ProfilesWriteMeService, swipeProfilesService: SwipeProfilesService, nearbyProfilesService: NearbyProfilesService, profilesReadService: ProfilesReadService);
    createBasicProfile(payload: CreateBasicProfileDto, client: ClientData): Promise<{
        type: string;
        data: import("../models").BasicProfile;
    }>;
    uploadBasicPhoto(clientData: ClientData, payload: UploadPhotoDtoDto, file?: Express.Multer.File): Promise<{
        type: string;
        data: import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, import("../models/schemas/media-file.schema").MediaFile> & import("../models/schemas/media-file.schema").MediaFile & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>>;
    }>;
    getProfile(clientData: ClientData): Promise<{
        type: string;
        data: Profile | import("../models").BasicProfile;
    }>;
    private updateMe;
    findManySwipe(queryParams: FindManySwipeProfilesQuery, clientData: ClientData): Promise<PaginatedResponse<Profile>>;
    findManyNearby(queryParams: FindManyNearbyProfilesQuery, clientData: ClientData): Promise<{
        type: string;
        data: Profile[];
        pagination: import("../../types").Pagination;
    }>;
    test(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Profile> & Profile & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>> & import("mongoose").Document<unknown, {}, Profile> & Profile & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    findOneById(id: string, client: ClientData): Promise<{
        type: string;
        data: Profile;
    }>;
}
