import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CommonModel } from './common-model';
import { View, ViewDocument } from './schemas/view.schema';

@Injectable()
export class ViewModel extends CommonModel<View> {
  constructor(
    @InjectModel(View.name)
    readonly model: Model<ViewDocument>,
  ) {
    super();
  }
}
