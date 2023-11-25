import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { ERROR_MESSAGES } from '../../commons/messages';
import { ApiService } from '../../commons/services/api.service';
import { MEDIA_FILE_TYPES } from '../../constants';
import { FilesService } from '../../libs/files.service';
import { ClientData } from '../auth/auth.type';
import { MediaFileModel, ProfileModel } from '../models';
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
    const profile = await this.profileModel.findOneOrFailById(_currentUserId);
    this.profileModel.verifyCanUploadFiles(profile);
    const photo = await this.filesService.uploadPhoto(file);
    const mediaFile = await this.mediaFileModel.createOne({
      _userId: _currentUserId,
      key: photo.Key,
      type: MEDIA_FILE_TYPES.photo,
      location: photo.Location,
    });
    const updateResult = await this.profileModel
      .updateOneById(_currentUserId, {
        $push: {
          mediaFiles: {
            _id: mediaFile._id,
            key: photo.Key,
            type: MEDIA_FILE_TYPES.photo,
          },
        },
      })
      .catch(() => {
        return undefined;
      });
    if (!updateResult?.modifiedCount) {
      await this.filesService.removeOne(mediaFile.key);
      await this.mediaFileModel.deleteOneOrFail({ _id: mediaFile._id });
      throw new InternalServerErrorException(
        ERROR_MESSAGES['File does not exist'],
      );
    }
    return mediaFile;
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
}
