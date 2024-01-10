import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { ApiBaseService } from '../../commons';
import { ERROR_MESSAGES } from '../../commons/messages';
import { FilesService } from '../../libs/files.service';
import { MediaFileModel, ProfileModel } from '../../models';
import { ProfilesUtil } from '../../utils';
import { ClientData } from '../auth/auth.type';
import { UploadPhotoDtoDto } from './dto/upload-photo.dto';

@Injectable()
export class MediaFilesService extends ApiBaseService {
  constructor(
    private readonly filesService: FilesService,
    private readonly profileModel: ProfileModel,
    private readonly mediaFileModel: MediaFileModel,
    private readonly profilesUtil: ProfilesUtil,
  ) {
    super();
  }

  logger = new Logger(MediaFilesService.name);

  public async uploadPhoto(
    file: Express.Multer.File,
    payload: UploadPhotoDtoDto,
    client: ClientData,
  ) {
    const { _currentUserId } = this.getClient(client);
    const profile = await this.profileModel.findOneOrFailById(_currentUserId);
    this.profilesUtil.verifyCanUploadFiles(profile);
    const mediaFile = await this.filesService.createPhoto(file, _currentUserId);
    await this.filesService.updateProfileAfterCreatePhoto(
      mediaFile,
      _currentUserId,
    );
    return mediaFile;
  }

  public async deleteOne(id: string, client: ClientData) {
    const _id = this.getObjectId(id);
    const { _currentUserId } = this.getClient(client);
    const profile = await this.profileModel.findOneOrFail(
      { _id: _currentUserId, 'mediaFiles._id': _id },
      { _id: true, mediaFiles: true },
    );
    if (profile.mediaFiles.length <= 1) {
      throw new BadRequestException(
        ERROR_MESSAGES['You should have at least 1 photo'],
      );
    }
    const updateResult = await this.profileModel.updateOne(
      { _id: _currentUserId, 'mediaFiles._id': _id },
      { $pull: { mediaFiles: { _id } } },
    );
    if (!updateResult.modifiedCount) {
      throw new InternalServerErrorException();
    }
    await this.mediaFileModel
      .deleteOne({
        _id,
        _userId: _currentUserId,
      })
      .catch((error) => {
        this.logger.error(
          `Failed to delete media file ${id} error ${JSON.stringify(error)}`,
        );
      });
    // TODO: queue
    const mediaFile = profile.mediaFiles.find((e) => e._id.toString() === id);
    if (mediaFile && mediaFile.key) {
      await this.filesService.removeOne(mediaFile.key).catch((err) => {
        this.logger.error(`Cannot delete file ${mediaFile.key}`, err.stack);
      });
    }
  }
}
