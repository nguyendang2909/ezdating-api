import { Injectable } from '@nestjs/common';

import { ApiReadService } from '../../commons';
import { CourseCategory } from '../../models';
import { CourseCategoryModel } from '../../models/course-category.model';

@Injectable()
export class CourseCategoriesService extends ApiReadService<CourseCategory> {
  constructor(private courseCategoryModel: CourseCategoryModel) {
    super();
  }

  public async findAll(): Promise<CourseCategory[]> {
    return await this.courseCategoryModel.findMany({});
  }
}
