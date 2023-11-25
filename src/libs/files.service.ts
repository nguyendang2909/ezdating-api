import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
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
import { MediaFileModel, ProfileModel } from '../modules/models';

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
    const mediaFile = await this.mediaFileModel.createOne({
      _userId: _currentUserId,
      key: photo.Key,
      type: MEDIA_FILE_TYPES.photo,
      location: photo.Location,
    });
    const updateResult = await this.profileModel.updateOneById(_currentUserId, {
      $push: {
        mediaFiles: {
          _id: mediaFile._id,
          key: photo.Key,
          type: MEDIA_FILE_TYPES.photo,
        },
      },
    });
    if (!updateResult.modifiedCount) {
      await this.removeOne(mediaFile.key);
      await this.mediaFileModel.deleteOneOrFail({ _id: mediaFile._id });
      throw new InternalServerErrorException(
        ERROR_MESSAGES['File does not exist'],
      );
    }
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
}
