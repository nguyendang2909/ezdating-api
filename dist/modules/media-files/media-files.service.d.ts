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
import { Logger } from '@nestjs/common';
import { ApiService } from '../../commons/services/api.service';
import { FilesService } from '../../libs/files.service';
import { ClientData } from '../auth/auth.type';
import { MediaFileModel, ProfileModel } from '../models';
import { UploadPhotoDtoDto } from './dto/upload-photo.dto';
export declare class MediaFilesService extends ApiService {
    private readonly filesService;
    private readonly profileModel;
    private readonly mediaFileModel;
    constructor(filesService: FilesService, profileModel: ProfileModel, mediaFileModel: MediaFileModel);
    logger: Logger;
    uploadPhoto(file: Express.Multer.File, payload: UploadPhotoDtoDto, client: ClientData): Promise<import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, import("../models/schemas/media-file.schema").MediaFile> & import("../models/schemas/media-file.schema").MediaFile & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>>;
    deleteOne(id: string, client: ClientData): Promise<void>;
}
