import { BadRequestException, Injectable } from '@nestjs/common';
import { FlattenMaps, Types } from 'mongoose';

import { APP_CONFIG } from '../../app.config';
import { HttpErrorMessages } from '../../commons/erros/http-error-messages.constant';
import { ApiService } from '../../commons/services/api.service';
import { MEDIA_FILE_TYPES } from '../../constants';
import { FilesService } from '../../libs/files.service';
import { ClientData } from '../auth/auth.type';
import { ProfileModel } from '../models/profile.model.ts';
import { Profile, ProfileDocument } from '../models/schemas/profile.schema';
import { UploadPhotoDtoDto } from './dto/upload-photo.dto';

@Injectable()
export class MediaFilesService extends ApiService {
  constructor(
    private readonly filesService: FilesService,
    private readonly profileModel: ProfileModel,
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
    const profile = await this.profileModel.findOneOrFail(
      { _id: _currentUserId },
      {
        _id: true,
        mediaFiles: true,
        status: true,
      },
    );
    this.verifyCanUploadFiles(profile);
    const photo = await this.filesService.updatePhoto(file);
    const createResult = await this.profileModel.findOneAndUpdate(
      { _id: _currentUserId },
      {
        $push: {
          mediaFiles: {
            _userId: _currentUserId,
            key: photo.Key,
            type: MEDIA_FILE_TYPES.photo,
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

    return createResult?.mediaFiles?.find((e) => e.key === photo.Key);
  }

  public async deleteOne(id: string, clientData: ClientData) {
    const _id = this.getObjectId(id);
    const { id: currentUserId } = clientData;
    const _currentUserId = this.getObjectId(currentUserId);
    const profile = await this.profileModel.findOneOrFail(
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
    await this.profileModel.updateOneOrFailById(_currentUserId, {
      $pull: {
        mediaFiles: {
          _id,
        },
      },
    });
    const filePath = profile.mediaFiles?.find(
      (e) => e._id.toString() === id,
    )?.key;
    if (filePath) {
      await this.filesService.removeOne(filePath);
    }
  }

  public verifyCanUploadFiles(
    user: ProfileDocument | (FlattenMaps<Profile> & { _id: Types.ObjectId }),
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
