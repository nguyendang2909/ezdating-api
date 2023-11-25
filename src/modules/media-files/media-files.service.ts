import { BadRequestException, Injectable } from '@nestjs/common';
import { FlattenMaps, Types } from 'mongoose';

import { APP_CONFIG } from '../../app.config';
import { ERROR_MESSAGES } from '../../commons/messages/error-messages.constant';
import { ApiService } from '../../commons/services/api.service';
import { MEDIA_FILE_TYPES } from '../../constants';
import { FilesService } from '../../libs/files.service';
import { ClientData } from '../auth/auth.type';
import { MediaFileModel, ProfileModel } from '../models';
import { Profile, ProfileDocument } from '../models/schemas/profile.schema';
import { UploadPhotoDtoDto } from './dto/upload-photo.dto';

@Injectable()
export class MediaFilesService extends ApiService {
  constructor(
    private readonly filesService: FilesService,
    private readonly profileModel: ProfileModel,
    private readonly mediaFileModel: MediaFileModel,
  ) {
    super();
  }

  public async uploadPhoto(
    file: Express.Multer.File,
    payload: UploadPhotoDtoDto,
    client: ClientData,
  ) {
    const { _currentUserId } = this.getClient(client);
    const profile = await this.profileModel.findOneOrFail(
      { _id: _currentUserId },
      {
        _id: true,
        mediaFiles: true,
        status: true,
      },
    );
    this.verifyCanUploadFiles(profile);
    const photo = await this.filesService.uploadPhoto(file);
    const mediaFile = await this.mediaFileModel.createOne({
      _userId: _currentUserId,
      key: photo.Key,
      type: MEDIA_FILE_TYPES.photo,
      location: photo.Location,
    });
    const createResult = await this.profileModel.findOneAndUpdate(
      { _id: _currentUserId },
      {
        $push: {
          mediaFiles: {
            _id: mediaFile._id,
            key: photo.Key,
            type: MEDIA_FILE_TYPES.photo,
          },
        },
      },
      {
        new: true,
        lean: true,
      },
    );
    return createResult?.mediaFiles?.find((e) => e.key === photo.Key);
  }

  public async deleteOne(id: string, client: ClientData) {
    const _id = this.getObjectId(id);
    const { _currentUserId } = this.getClient(client);
    const profileWithMediaFile = await this.profileModel.findOneOrFail(
      {
        _id: _currentUserId,
        'mediaFiles._id': _id,
      },
      {
        _id: true,
        key: true,
      },
    );
    await this.mediaFileModel.deleteOne({
      _id,
      _userId: _currentUserId,
    });
    await this.profileModel.updateOne(
      {
        _id: _currentUserId,
        'mediaFiles._id': _id,
      },
      {
        $pull: {
          mediaFiles: {
            _id,
          },
        },
      },
    );
    // TODO: queue
    const mediaFile = profileWithMediaFile.mediaFiles.find(
      (e) => e._id.toString() === id,
    );
    if (mediaFile && mediaFile.key) {
      this.filesService.removeOne(mediaFile.key);
    }
  }

  public verifyCanUploadFiles(
    user: ProfileDocument | (FlattenMaps<Profile> & { _id: Types.ObjectId }),
  ): number {
    const count = user.mediaFiles?.length || 0;
    if (count >= APP_CONFIG.UPLOAD_PHOTOS_LIMIT) {
      throw new BadRequestException({
        message: ERROR_MESSAGES['You can only upload 6 media files'],
      });
    }
    return count;
  }
}
