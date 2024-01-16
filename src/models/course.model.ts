import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CommonModel } from './bases/common-model';
import { Course, CourseDocument } from './schemas';

@Injectable()
export class CourseModel extends CommonModel<Course> {
  constructor(@InjectModel(Course.name) readonly model: Model<CourseDocument>) {
    super();
  }

  private readonly logger = new Logger(CourseModel.name);
}
