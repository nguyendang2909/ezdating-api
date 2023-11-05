import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { HttpErrorMessages } from '../../commons/erros/http-error-messages.constant';
import { CacheService } from '../../libs';
import { CommonModel } from './common-model';
import { MediaFile, MediaFileDocument } from './schemas/media-file.schema';

@Injectable()
export class MediaFileModel extends CommonModel<MediaFile> {
  constructor(
    @InjectModel(MediaFile.name) readonly model: Model<MediaFileDocument>,
    private readonly cacheService: CacheService,
  ) {
    super();
    this.notFoundMessage = HttpErrorMessages['Media file does not exist'];
    this.conflictMessage = HttpErrorMessages['Media file already exists'];
  }
}
