import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import _ from 'lodash';
import {
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import { Types } from 'mongoose';

import { APP_CONFIG } from '../../app.config';
import { HttpErrorMessages } from '../../commons/erros/http-error-messages.constant';
import { CommonModel } from './common-model';
import { MediaFile, MediaFileDocument } from './schemas/media-file.schema';

@Injectable()
export class MediaFileModel extends CommonModel {
  constructor(
    @InjectModel(MediaFile.name)
    private readonly model: Model<MediaFile>,
  ) {
    super();
  }

  public async createOne(entity: Partial<MediaFileDocument>) {
    const mediaFile = await this.model.create(entity);

    return mediaFile.toJSON();
  }

  public async countDocuments(
    filter: FilterQuery<MediaFileDocument>,
    options?: QueryOptions<MediaFileDocument>,
  ) {
    return await this.model
      .countDocuments(filter, {
        ...options,
        limit: APP_CONFIG.PAGINATION_LIMIT.MEDIA_FILES,
      })
      .exec();
  }

  public async findOne(
    filter: FilterQuery<MediaFileDocument>,
    projection?: ProjectionType<MediaFileDocument> | null,
    options?: QueryOptions<MediaFileDocument> | null,
  ) {
    if (_.isEmpty(filter)) {
      return null;
    }
    return await this.model.findOne(filter, projection, options).lean().exec();
  }

  public async findOneOrFail(
    filter: FilterQuery<MediaFileDocument>,
    projection?: ProjectionType<MediaFileDocument> | null,
    options?: QueryOptions<MediaFileDocument> | null,
  ) {
    const findResult = await this.findOne(filter, projection, options);
    if (!findResult) {
      throw new NotFoundException({
        message: HttpErrorMessages['File does not exist.'],
      });
    }

    return findResult;
  }

  public async findMany(
    filter: FilterQuery<MediaFileDocument>,
    projection?: ProjectionType<MediaFileDocument> | null | undefined,
    options?: QueryOptions<MediaFileDocument> | null | undefined,
  ) {
    return await this.model
      .find(filter, projection, {
        ...options,
        limit: APP_CONFIG.PAGINATION_LIMIT.MEDIA_FILES,
      })
      .lean()
      .exec();
  }

  public async updateOneById(
    _id: Types.ObjectId,
    updateQuery: UpdateQuery<MediaFile>,
  ) {
    const updateResult = await this.model.updateOne({ _id }, updateQuery);

    return !!updateResult.modifiedCount;
  }

  public async deleteOneByIdAndUserId(
    _id: Types.ObjectId,
    _userId: Types.ObjectId,
  ) {
    const deleteResult = await this.model.deleteOne({ _id, _userId });
    // TODO: Remove item from AWS S3
    return !!deleteResult.deletedCount;
  }
}
