import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CommonModel } from './bases/common-model';
import { CourseCategory, CourseCategoryDocument } from './schemas';

@Injectable()
export class CourseCategoryModel extends CommonModel<CourseCategory> {
  constructor(
    @InjectModel(CourseCategory.name)
    readonly model: Model<CourseCategoryDocument>,
  ) {
    super();
  }
}
