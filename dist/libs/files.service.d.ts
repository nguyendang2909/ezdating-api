/// <reference types="multer" />
import { S3 } from 'aws-sdk';
import mongoose from 'mongoose';
import { MediaFileModel, ProfileModel } from '../modules/models';
import { MediaFile } from '../modules/models/schemas/media-file.schema';
export declare class FilesService {
    private readonly mediaFileModel;
    private readonly profileModel;
    constructor(mediaFileModel: MediaFileModel, profileModel: ProfileModel);
    private readonly awsBucketName;
    private readonly s3;
    private readonly logger;
    uploadPhoto(file: Express.Multer.File): Promise<S3.ManagedUpload.SendData>;
    createPhoto(file: Express.Multer.File, _currentUserId: mongoose.Types.ObjectId): Promise<mongoose.FlattenMaps<mongoose.Document<unknown, {}, MediaFile> & MediaFile & Required<{
        _id: mongoose.Types.ObjectId;
    }>>>;
    removeOne(filePath: string): Promise<import("aws-sdk/lib/request").PromiseResult<S3.DeleteObjectOutput, import("aws-sdk").AWSError> | undefined>;
    removeOneAndCatch(photo: S3.ManagedUpload.SendData): Promise<void>;
    updateProfileAfterCreatePhoto(mediaFile: MediaFile, _currentUserId: mongoose.Types.ObjectId): Promise<void>;
    verifyUpdateProfileAfterCreatePhoto(mediaFile: MediaFile, updateResult: mongoose.UpdateWriteOpResult | undefined): Promise<void>;
    removeMediaFile(mediaFile: MediaFile): Promise<void>;
    removeMediaFileAndCatch(mediaFile: MediaFile): Promise<void>;
}
