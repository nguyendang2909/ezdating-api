import { BadRequestException, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

import { User } from '../users/entities/user.entity';
import { FindManyUploadFilesDto } from './dto/find-many-upload-files.dto';
import { UploadFileEntity } from './upload-file-entity.service';
import {
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

  public async uploadPhoto(file: Express.Multer.File, userId: string) {
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
    const photo = await this.s3
      .upload({
        Bucket: this.awsBucketName,
        Key: `photos/${file.filename}`,
        Body: file.buffer,
        ACL: 'public-read',
      })
      .promise();
    const createResult = await this.uploadFileEntity.saveOne(
      {
        user: new User({ id: userId }),
        key: photo.Key,
        type: EUploadFileType.photo,
        location: photo.Location,
      },
      userId,
    );
    return createResult;
  }

  public async findAllPhotos(
    queryParams: FindManyUploadFilesDto,
    userId: string,
  ) {
    const { f, ...findDto } = queryParams;
    return await this.uploadFileEntity.findMany({
      where: {
        ...findDto,
      },
      select: f,
    });
  }
}
