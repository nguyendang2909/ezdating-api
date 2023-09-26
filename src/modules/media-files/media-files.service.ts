import { BadRequestException, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { Types } from 'mongoose';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

import { APP_CONFIG } from '../../app.config';
import { MediaFileTypes } from '../../commons/constants';
import { HttpErrorMessages } from '../../commons/erros/http-error-messages.constant';
import { ApiService } from '../../commons/services/api.service';
import { ClientData } from '../auth/auth.type';
import { MediaFileModel } from '../models/media-file.model';
import { UserModel } from '../models/user.model';
import { UploadPhotoDtoDto } from './dto/upload-photo.dto';

@Injectable()
export class MediaFilesService extends ApiService {
  constructor(
    private readonly mediaFileModel: MediaFileModel,
    private readonly userModel: UserModel,
  ) {
    super();
  }

  private readonly s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'ap-southeast-1',
  });

  private readonly awsBucketName = process.env.AWS_BUCKET_NAME;

  public async uploadPhoto(
    file: Express.Multer.File,
    payload: UploadPhotoDtoDto,
    clientData: ClientData,
  ) {
    const { id: currentUserId } = clientData;
    const _currentUserId = this.getObjectId(currentUserId);
    await this.verifyCanUploadFiles(_currentUserId);
    const fileBufferWithSharp = await sharp(file.buffer)
      .resize(640, 860)
      .toFormat('webp')
      .toBuffer();
    const photo = await this.s3
      .upload({
        Bucket: this.awsBucketName,
        Key: `photos/${uuidv4()}.webp`,
        Body: fileBufferWithSharp,
        ACL: 'public-read',
      })
      .promise();
    await this.verifyCanUploadFiles(_currentUserId);
    return await this.mediaFileModel.createOne({
      _userId: _currentUserId,
      key: photo.Key,
      type: MediaFileTypes.photo,
      location: photo.Location,
    });
  }

  public async deleteOne(id: string, clientData: ClientData) {
    const _id = this.getObjectId(id);
    const { id: currentUserId } = clientData;
    const _currentUserId = this.getObjectId(currentUserId);
    const deleted = await this.mediaFileModel.deleteOneByIdAndUserId(
      _id,
      _currentUserId,
    );
    // TODO: Remove s3
    return deleted;
  }

  public async verifyCanUploadFiles(_userId: Types.ObjectId): Promise<number> {
    const count = await this.mediaFileModel.countDocuments(
      { _userId },
      { limit: 6 },
    );

    if (count >= APP_CONFIG.UPLOAD_PHOTOS_LIMIT) {
      throw new BadRequestException({
        message: HttpErrorMessages['You can only upload 6 media files.'],
      });
    }

    return count;
  }
}
