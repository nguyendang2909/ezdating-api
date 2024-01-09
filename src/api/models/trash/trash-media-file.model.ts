import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CommonModel } from '../bases';
import { TrashMediaFile, TrashMediaFileDocument } from '../schemas';

@Injectable()
export class TrashMediaFileModel extends CommonModel<TrashMediaFile> {
  constructor(
    @InjectModel(TrashMediaFile.name)
    readonly model: Model<TrashMediaFileDocument>,
  ) {
    super();
  }
}
