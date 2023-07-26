import { BadRequestException, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

import { AppConfig } from '../../app.config';
import { UploadFileTypes } from '../../commons/constants/constants';
import { HttpErrorCodes } from '../../commons/erros/http-error-codes.constant';
import { UploadFile } from '../entities/entities/upload-file.entity';
import { User } from '../entities/entities/user.entity';
import { UploadFileModel } from '../entities/upload-file.model';
import { UserModel } from '../entities/user.model';
import { FindManyUploadFilesDto } from './dto/find-many-upload-files.dto';
import { FindOneUploadFileByIdDto } from './dto/find-one-upload-file-by-id.dto';
import { UploadPhotoDtoDto } from './dto/upload-photo.dto';

@Injectable()
export class UploadFilesService {
  constructor(
    private readonly uploadFileModel: UploadFileModel,
    private readonly userModel: UserModel,
  ) {}
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
    const { isAvatar } = payload;
    await this.verifyCanUploadFiles(userId);
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
    await this.verifyCanUploadFiles(userId);
    const createResult = await this.uploadFileModel.saveOne(
      {
        user: new User({ id: userId }),
        key: photo.Key,
        type: UploadFileTypes.photo,
        location: photo.Location,
      },
      userId,
    );
    if (isAvatar) {
      await this.userModel.updateOneById(userId, {
        avatarFile: { id: createResult.id },
      });
    }

    return createResult;
  }

  public async findMany(queryParams: FindManyUploadFilesDto, userId: string) {
    const { targetUserId, type, cursor, ...findDto } = queryParams;
    return await this.uploadFileModel.findMany({
      where: {
        type,
        ...(targetUserId
          ? {
              user: {
                id: targetUserId,
              },
            }
          : {}),
      },
      select: {
        id: true,
      },
    });
  }

  public async findOneById(
    id: string,
    queryParams: FindOneUploadFileByIdDto,
    userId: string,
  ): Promise<Partial<UploadFile> | null> {
    return await this.uploadFileModel.findOne({
      where: [
        { id, user: { id: userId } },
        {
          id,
        },
      ],
      select: {
        id: true,
      },
    });
  }

  public async findOneOrFailById(
    id: string,
    queryParams: FindOneUploadFileByIdDto,
    userId: string,
  ): Promise<Partial<UploadFile>> {
    const findResult = await this.findOneById(id, queryParams, userId);
    if (!findResult) {
      throw new BadRequestException({
        errorCode: 'FILE_DOES_NOT_EXIST',
        message: 'File does not exist!',
      });
    }
    return findResult;
  }

  public async remove(id: string, userId: string) {
    // const currentUser = await this.userEntity.findOneOrFail({
    //   where: { id: userId },
    //   relations: ['avatarFile'],
    // });
    // if (currentUser.avatarFile?.id === id) {
    //   await this.userEntity.updateOneById(userId, {
    //     avatarFile: {},
    //   });
    // }

    const deleted = await this.uploadFileModel.deleteOne({
      id,
      user: { id: userId },
    });
    // TODO: Remove avatar
    return deleted;
  }

  public async verifyCanUploadFiles(userId: string): Promise<number> {
    const numberUploadedPhotos = await this.uploadFileModel.count({
      where: {
        user: {
          id: userId,
        },
      },
    });

    if (numberUploadedPhotos >= AppConfig.UPLOAD_PHOTOS_LIMIT) {
      throw new BadRequestException({
        errorCode: HttpErrorCodes.LIMIT_UPLOADED_FILES,
        message: 'You can only upload 6 photos!',
      });
    }

    return numberUploadedPhotos;
  }
}
