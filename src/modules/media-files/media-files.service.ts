import { BadRequestException, Injectable } from '@nestjs/common';
import { FlattenMaps, Types } from 'mongoose';

import { APP_CONFIG } from '../../app.config';
import { MediaFileTypes } from '../../commons/constants';
import { HttpErrorMessages } from '../../commons/erros/http-error-messages.constant';
import { ApiService } from '../../commons/services/api.service';
import { FilesService } from '../../libs/files.service';
import { ClientData } from '../auth/auth.type';
import { User, UserDocument } from '../models/schemas/user.schema';
import { UserModel } from '../models/user.model';
import { UploadPhotoDtoDto } from './dto/upload-photo.dto';

@Injectable()
export class MediaFilesService extends ApiService {
  constructor(
    private readonly userModel: UserModel,
    private readonly filesService: FilesService,
  ) {
    super();
  }

  public async uploadPhoto(
    file: Express.Multer.File,
    payload: UploadPhotoDtoDto,
    clientData: ClientData,
  ) {
    const { id: currentUserId } = clientData;
    const _currentUserId = this.getObjectId(currentUserId);
    const user = await this.userModel.findOneOrFail(
      { _id: _currentUserId },
      {
        _id: true,
        mediaFiles: true,
        status: true,
      },
    );
    this.verifyCanUploadFiles(user);
    const photo = await this.filesService.updatePhoto(file);
    const createResult = await this.userModel.findOneAndUpdate(
      { _id: _currentUserId },
      {
        $push: {
          mediaFiles: {
            _userId: _currentUserId,
            key: photo.Key,
            type: MediaFileTypes.photo,
            location: photo.Location,
          },
        },
      },
      {
        new: true,
        projection: {
          mediaFiles: true,
        },
        lean: true,
      },
    );

    console.log(createResult);
    return createResult?.mediaFiles?.find((e) => e.key === photo.Key);
  }

  public async deleteOne(id: string, clientData: ClientData) {
    const _id = this.getObjectId(id);
    const { id: currentUserId } = clientData;
    const _currentUserId = this.getObjectId(currentUserId);
    const user = await this.userModel.findOneOrFail(
      {
        _id: _currentUserId,
        'mediaFiles._id': _id,
      },
      {
        _id: true,
        status: true,
        mediaFiles: {
          _id: true,
          key: true,
        },
      },
    );
    await this.userModel.updateOneOrFailById(_currentUserId, {
      $pull: {
        mediaFiles: {
          _id,
        },
      },
    });
    const filePath = user.mediaFiles?.find((e) => e._id.toString() === id)?.key;
    if (filePath) {
      await this.filesService.removeOne(filePath);
    }
  }

  public verifyCanUploadFiles(
    user: UserDocument | (FlattenMaps<User> & { _id: Types.ObjectId }),
  ): number {
    const count = user.mediaFiles?.length || 0;
    if (count >= APP_CONFIG.UPLOAD_PHOTOS_LIMIT) {
      throw new BadRequestException({
        message: HttpErrorMessages['You can only upload 6 media files'],
      });
    }
    return count;
  }
}
