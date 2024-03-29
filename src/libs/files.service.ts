import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import async from 'async';
import { S3 } from 'aws-sdk';
import mongoose from 'mongoose';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

import { ERROR_MESSAGES } from '../commons/messages';
import { MEDIA_FILE_TYPES } from '../constants';
import {
  FILE_UPLOAD_FOLDERS,
  FILE_UPLOAD_FOLDERS_ARR,
} from '../constants/common.constants';
import { MediaFileModel, ProfileModel } from '../models';
import { MediaFile } from '../models/schemas/media-file.schema';

@Injectable()
export class FilesService {
  constructor(
    private readonly mediaFileModel: MediaFileModel,
    private readonly profileModel: ProfileModel,
  ) {}

  private readonly awsBucketName = process.env.AWS_BUCKET_NAME;

  private readonly s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'ap-southeast-1',
  });

  private readonly logger = new Logger(FilesService.name);

  async uploadPhoto(file: Express.Multer.File) {
    const fileBufferWithSharp = await sharp(file.buffer)
      .resize(640, 860)
      .toFormat('webp')
      .toBuffer();
    return await this.s3
      .upload({
        Bucket: this.awsBucketName,
        Key: `${FILE_UPLOAD_FOLDERS.PHOTOS}/${uuidv4()}.webp`,
        Body: fileBufferWithSharp,
        ACL: 'public-read',
      })
      .promise();
  }

  async createPhoto(
    file: Express.Multer.File,
    _currentUserId: mongoose.Types.ObjectId,
  ) {
    const photo = await this.uploadPhoto(file);
    const mediaFile = await this.mediaFileModel
      .createOne({
        _userId: _currentUserId,
        key: photo.Key,
        type: MEDIA_FILE_TYPES.photo,
        location: photo.Location,
      })
      .catch(async (error) => {
        this.logger.error(
          `Failed to create media file ${JSON.stringify(error)}`,
        );
        await this.removeOneAndCatch(photo);
        throw new InternalServerErrorException(
          ERROR_MESSAGES['Create failed, please try again'],
        );
      });
    return mediaFile;
  }

  public async removeOne(filePath: string) {
    const [folder, filename] = filePath.split('/');
    if (!FILE_UPLOAD_FOLDERS_ARR.includes(folder) || !filename) {
      this.logger.error(`REMOVE_S3_FILE File does not exist: ${filePath}`);
      return;
    }
    return await this.s3
      .deleteObject({
        Bucket: this.awsBucketName,
        Key: filePath,
      })
      .promise();
  }

  public async removeMany(filePaths: string[], limit = 6) {
    return async.eachLimit(filePaths, limit, async (filePath) => {
      try {
        await this.removeOne(filePath);
      } catch (err) {
        this.logger.error(`Error when remove file from S3: ${filePath}`);
      }
    });
  }

  public async removeManyByMediaFiles(mediaFiles: MediaFile[], limit = 6) {
    return async.eachLimit(mediaFiles, limit, async (mediaFile) => {
      try {
        await this.removeOne(mediaFile.key);
      } catch (err) {
        this.logger.error(`Error when remove file from S3: ${mediaFile.key}`);
      }
    });
  }

  public async removeOneAndCatch(photo: S3.ManagedUpload.SendData) {
    try {
      await this.removeOne(photo.Key);
    } catch (err) {
      this.logger.error(
        `S3 Failed to remove file ${photo.Key} with error: ${JSON.stringify(
          err,
        )}`,
      );
    }
  }

  public async updateProfileAfterCreatePhoto(
    mediaFile: MediaFile,
    _currentUserId: mongoose.Types.ObjectId,
  ) {
    const updateResult = await this.profileModel
      .updateOneById(_currentUserId, {
        $push: {
          mediaFiles: {
            _id: mediaFile._id,
            key: mediaFile.key,
            type: mediaFile.type,
          },
        },
      })
      .catch(() => {
        return undefined;
      });
    await this.verifyUpdateProfileAfterCreatePhoto(mediaFile, updateResult);
  }

  async verifyUpdateProfileAfterCreatePhoto(
    mediaFile: MediaFile,
    updateResult: mongoose.UpdateWriteOpResult | undefined,
  ) {
    if (!updateResult?.modifiedCount) {
      await this.removeMediaFileAndCatch(mediaFile);
      throw new InternalServerErrorException(
        ERROR_MESSAGES['File does not exist'],
      );
    }
  }

  async removeMediaFile(mediaFile: MediaFile) {
    await this.removeOne(mediaFile.key);
    await this.mediaFileModel.deleteOneOrFail({ _id: mediaFile._id });
  }

  async removeMediaFileAndCatch(mediaFile: MediaFile) {
    try {
      await this.removeMediaFile(mediaFile);
    } catch (error) {
      this.logger.error(`Failed to remove photo ${JSON.stringify(error)}`);
    }
  }
}
