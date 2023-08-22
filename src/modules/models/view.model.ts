import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CommonModel } from './common-model';
import { View } from './schemas/view.schema';

@Injectable()
export class ViewModel extends CommonModel {
  constructor(
    @InjectModel(View.name)
    public readonly model: Model<View>,
  ) {
    super();
  }
}
