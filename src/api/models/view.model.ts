import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ERROR_MESSAGES } from '../../commons/messages';
import { CommonModel } from './bases/common-model';
import { View, ViewDocument } from './schemas/view.schema';

@Injectable()
export class ViewModel extends CommonModel<View> {
  constructor(
    @InjectModel(View.name)
    readonly model: Model<ViewDocument>,
  ) {
    super();
    this.notFoundMessage = ERROR_MESSAGES['View does not exist'];
    this.conflictMessage = ERROR_MESSAGES['View already exists'];
  }
}
