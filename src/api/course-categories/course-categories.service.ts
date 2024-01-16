import { Injectable } from '@nestjs/common';

import { ApiBaseService } from '../../commons';
import { CourseCategory } from '../../models';
import { CourseCategoryModel } from '../../models/course-category.model';
import { IApiBaseService } from '../../types';

@Injectable()
export class CourseCategoriesService
  extends ApiBaseService
  implements IApiBaseService
{
  constructor(private courseCategoryModel: CourseCategoryModel) {
    super();
  }

  public async findAll(): Promise<CourseCategory[]> {
    return await this.courseCategoryModel.findMany({});
  }

  public async findOneById(id: string) {
    return await this.courseCategoryModel.findOneOrFailById(
      this.getObjectId(id),
    );
  }
}
