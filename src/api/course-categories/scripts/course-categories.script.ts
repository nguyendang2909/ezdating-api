import { Injectable } from '@nestjs/common';

import { COURSE_CATEGORIES } from '../../../constants';
import { CourseCategoryModel } from '../../../models/course-category.model';

@Injectable()
export class CourseCategoriesScript {
  constructor(private readonly courseCategoryModel: CourseCategoryModel) {}

  onApplicationBootstrap() {
    this.run();
  }

  async run() {
    for (const e of COURSE_CATEGORIES) {
      await this.courseCategoryModel.findOneAndUpdate({ tag: e.tag }, e, {
        new: true,
        upsert: true,
      });
    }
  }
}
