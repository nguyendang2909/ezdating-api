import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ERROR_MESSAGES } from '../commons/messages/error-messages.constant';
import { CommonModel } from './bases/common-model';
import { ProfileModel } from './profile.model';
import { MediaFile, MediaFileDocument } from './schemas/media-file.schema';

@Injectable()
export class MediaFileModel extends CommonModel<MediaFile> {
  constructor(
    @InjectModel(MediaFile.name) readonly model: Model<MediaFileDocument>,
    private readonly profileModel: ProfileModel,
  ) {
    super();
    this.notFoundMessage = ERROR_MESSAGES['Media file does not exist'];
    this.conflictMessage = ERROR_MESSAGES['Media file already exists'];
  }
}
