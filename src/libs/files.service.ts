import { Injectable, Logger } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

import {
  FILE_UPLOAD_FOLDERS,
  FILE_UPLOAD_FOLDERS_ARR,
} from '../constants/common.constants';

@Injectable()
export class FilesService {
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
