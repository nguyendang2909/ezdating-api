import { BadRequestException, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

import { User } from '../users/entities/user.entity';
import { FindManyUploadFilesDto } from './dto/find-many-upload-files.dto';
import { UploadPhotoDtoDto } from './dto/upload-photo.dto';
import { UploadFileEntity } from './upload-file-entity.service';
import {
  EUploadFileShare,
  EUploadFileType,
  LIMIT_UPLOADED_PHOTOS,
} from './upload-files.constant';

@Injectable()
export class UploadFilesService {
  constructor(private readonly uploadFileEntity: UploadFileEntity) {}
  private readonly s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'ap-southeast-1',
  });

  private readonly awsBucketName = process.env.AWS_BUCKET_NAME;

  public async uploadPhoto(
    file: Express.Multer.File,
    payload: UploadPhotoDtoDto,
    userId: string,
  ) {
    const { share } = payload;
    const numberUploadedPhotos = await this.uploadFileEntity.count({
      where: {
        user: new User({ id: userId }),
      },
    });
    if (numberUploadedPhotos >= LIMIT_UPLOADED_PHOTOS) {
      throw new BadRequestException({
        errorCode: 'LIMIT_UPLOADED_PHOTOS',
        message: 'You can only upload 6 photos!',
      });
    }
    const fileBufferWithSharp = await sharp(file.buffer)
      .resize(640, 860)
      .toFormat('webp')
      .toBuffer();
    const photo = await this.s3
      .upload({
        Bucket: this.awsBucketName,
        Key: `photos/${uuidv4()}.webp`,
        Body: fileBufferWithSharp,
        ACL: share === EUploadFileShare.public ? 'public-read' : 'private',
      })
      .promise();
    const createResult = await this.uploadFileEntity.saveOne(
      {
        user: new User({ id: userId }),
        key: photo.Key,
        type: EUploadFileType.photo,
        location: photo.Location,
        share,
      },
      userId,
    );
    return createResult;
  }

  public async findMany(queryParams: FindManyUploadFilesDto, userId: string) {
    const { f, targetUserId, cursor, ...findDto } = queryParams;
    return await this.uploadFileEntity.findMany({
      where: {
        ...findDto,
        ...(targetUserId ? { user: new User({ id: targetUserId }) } : {}),
      },
      select: f,
    });
  }

  public async remove(id: string, userId: string) {
    await this.uploadFileEntity.deleteOne(id, userId);
  }
}
