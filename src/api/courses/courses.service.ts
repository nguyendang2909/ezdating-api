import { Injectable } from '@nestjs/common';

import { ApiBaseService } from '../../commons';
import { Course, CourseCategoryModel, CourseModel } from '../../models';
import { IApiBaseService, Pagination } from '../../types';
import { ClientData } from '../auth/auth.type';
import { CreateCourseDto, UpdateCourseDto } from './dto';
import { FindManyCoursesQuery } from './dto/find-many-courses.query';

@Injectable()
export class CoursesService extends ApiBaseService implements IApiBaseService {
  constructor(
    private readonly courseModel: CourseModel,
    private readonly courseCategoryModel: CourseCategoryModel,
  ) {
    super();
  }

  async createOne(
    payload: CreateCourseDto,
    client: ClientData,
  ): Promise<Course> {
    const { courseCategoryId, ...rest } = payload;
    const { _currentUserId } = this.getClient(client);
    const _courseCategoryId = this.getObjectId(courseCategoryId);
    await this.courseCategoryModel.findOneOrFailById(_courseCategoryId);
    return await this.courseModel.createOne({
      _courseCategoryId,
      _userId: _currentUserId,
      ...rest,
    });
  }

  async findMany(
    queryParams: FindManyCoursesQuery,
    client: ClientData,
  ): Promise<{ data: Record<string, any>[]; pagination: Pagination }> {
    const { courseCategoryId, ...rest } = queryParams;
    const courses = await this.courseModel.findMany(
      {
        ...(courseCategoryId
          ? { _courseCategoryId: this.getObjectId(courseCategoryId) }
          : {}),
        ...rest,
      },
      {},
      { limit: 20 },
    );
    return {
      data: courses,
      pagination: {
        _next: null,
      },
    };
  }

  async findOneById(
    id: string,
    client: ClientData,
  ): Promise<Record<string, any>> {
    return await this.courseModel.findOneOrFailById(this.getObjectId(id));
  }

  async updateOneById(
    id: string,
    payload: UpdateCourseDto,
    client: ClientData,
  ): Promise<void> {
    const { _currentUserId } = this.getClient(client);
    await this.courseModel.updateOne(
      {
        _id: this.getObjectId(id),
        _userId: _currentUserId,
      },
      payload,
    );
  }

  async deleteOneById(id: string, client: ClientData): Promise<void> {
    const { _currentUserId } = this.getClient(client);
    const _courseId = this.getObjectId(id);
    await this.courseModel.findOneOrFail({
      _id: _courseId,
      _userId: _currentUserId,
    });
    await this.courseModel.deleteOneById(_courseId);
  }
}
