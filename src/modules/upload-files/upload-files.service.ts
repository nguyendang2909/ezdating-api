import { BadRequestException, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

import { UploadFile } from '../entities/entities/upload-file.entity';
import { User } from '../entities/entities/user.entity';
import { UploadFileModel } from '../entities/upload-file.model';
import { UserModel } from '../entities/users.model';
import { FindManyUploadFilesDto } from './dto/find-many-upload-files.dto';
import { FindOneUploadFileByIdDto } from './dto/find-one-upload-file-by-id.dto';
import { UploadPhotoDtoDto } from './dto/upload-photo.dto';
import {
  LIMIT_UPLOADED_PHOTOS,
  UploadFileShares,
  UploadFileTypes,
} from './upload-files.constant';

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
    const { share, isAvatar } = payload;
    const numberUploadedPhotos = await this.uploadFileModel.count({
      where: {
        user: {
          id: userId,
        },
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
        ACL: share === UploadFileShares.public ? 'public-read' : 'private',
      })
      .promise();
    const numberUploadedPhotosAgain = await this.uploadFileModel.count({
      where: {
        user: {
          id: userId,
        },
      },
    });
    if (numberUploadedPhotosAgain >= LIMIT_UPLOADED_PHOTOS) {
      throw new BadRequestException({
        errorCode: 'LIMIT_UPLOADED_PHOTOS',
        message: 'You can only upload 6 photos!',
      });
    }
    const createResult = await this.uploadFileModel.saveOne(
      {
        user: new User({ id: userId }),
        key: photo.Key,
        type: UploadFileTypes.photo,
        location: photo.Location,
        share,
      },
      userId,
    );
    if (isAvatar) {
      await this.userModel.updateOneById(
        userId,
        {
          avatarFile: { id: createResult.id },
        },
        userId,
      );
    }

    return createResult;
  }

  public async findMany(queryParams: FindManyUploadFilesDto, userId: string) {
    const { targetUserId, share, type, cursor, ...findDto } = queryParams;
    return await this.uploadFileModel.findMany({
      where: {
        share,
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
          share: UploadFileShares.public,
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
}
