import { Injectable, InternalServerErrorException } from '@nestjs/common';
import ffmpeg from 'fluent-ffmpeg';
import { Readable } from 'stream';

import { ApiBaseService } from '../../commons';
import { FilesService } from '../../libs';
import { CourseModel, Lession, LessionModel } from '../../models';
import { IApiBaseService, Pagination } from '../../types';
import { ClientData } from '../auth/auth.type';
import { CreateLessonDto, FindManyLessonsQuery, UpdateLessonDto } from './dto';

@Injectable()
export class LessonsService extends ApiBaseService implements IApiBaseService {
  constructor(
    private readonly lessonModel: LessionModel,
    private readonly courseModel: CourseModel,
    private readonly filesService: FilesService,
  ) {
    super();
  }

  async createOne(
    payload: CreateLessonDto,
    client: ClientData,
  ): Promise<Record<string, any>> {
    const { _currentUserId } = this.getClient(client);
    const { courseId, ...rest } = payload;
    const _courseId = this.getObjectId(courseId);
    await this.courseModel.findOneOrFail({
      _id: _courseId,
      _userId: _currentUserId,
    });
    return await this.lessonModel.createOne({ ...rest, _courseId });
  }

  async uploadVideo(id: string, file: Express.Multer.File, client: ClientData) {
    const { _currentUserId } = this.getClient(client);
    const _lessionId = this.getObjectId(id);
    const lesson = await this.lessonModel.findOneOrFailById(_lessionId);
    await this.courseModel.findOneOrFail({
      _id: lesson._courseId,
      _userId: _currentUserId,
    });
    const stream = Readable.from(file.buffer);
    const { writeStream, upload } = this.filesService.uploadVideoStream();
    ffmpeg(stream)
      .videoCodec('libx264')
      .size('1280x720')
      .format('mp4')
      .on('end', () => {
        this.logger.log(`Convert file to file successfully`);
      })
      .on('error', () => {
        throw new InternalServerErrorException('Cannot convert file');
      })
      .pipe(writeStream);
    upload
      .then(() => {
        this.logger.log(`Upload video successfully`);
      })
      .catch((err) => {
        this.logger.log(`Upload video successfully`);
      });
  }

  async findMany(
    queryParams: FindManyLessonsQuery,
    client: ClientData,
  ): Promise<{ data: Record<string, any>[]; pagination: Pagination }> {
    const findResults = await this.lessonModel.findMany({
      _courseId: this.getObjectId(queryParams.courseId),
    });
    return {
      data: findResults,
      pagination: {
        _next: null,
      },
    };
  }

  async findOneById(id: string, client: ClientData): Promise<Lession> {
    return await this.lessonModel.findOneOrFailById(this.getObjectId(id));
  }

  async updateOneById(
    id: string,
    payload: UpdateLessonDto,
    client: ClientData,
  ): Promise<void> {
    const { _currentUserId } = this.getClient(client);
    const _lessionId = this.getObjectId(id);
    const lesson = await this.lessonModel.findOneOrFailById(_lessionId);
    const { ...rest } = payload;
    await this.courseModel.findOneOrFail({
      _id: lesson._courseId,
      _userId: _currentUserId,
    });
    await this.lessonModel.updateOneById(_lessionId, {
      ...rest,
    });
  }

  async deleteOneById(id: string, client: ClientData): Promise<void> {
    const { _currentUserId } = this.getClient(client);
    const _lessionId = this.getObjectId(id);
    const lesson = await this.lessonModel.findOneOrFailById(_lessionId);
    await this.courseModel.findOneOrFail({
      _id: lesson._courseId,
      _userId: _currentUserId,
    });
    await this.lessonModel.deleteOneById(_lessionId);
  }
}
