import { Injectable } from '@nestjs/common';

import { CommonModel } from './common-model';

@Injectable()
export class MediaFileModel extends CommonModel {
  constructor() {
    super();
  }

  // public async createOne(entity: Partial<MediaFileDocument>) {
  //   const mediaFile = await this.model.create(entity);

  //   return mediaFile.toJSON();
  // }

  // public async countDocuments(
  //   filter: FilterQuery<MediaFileDocument>,
  //   options?: QueryOptions<MediaFileDocument>,
  // ) {
  //   return await this.model
  //     .countDocuments(filter, {
  //       ...options,
  //       limit: APP_CONFIG.PAGINATION_LIMIT.MEDIA_FILES,
  //     })
  //     .exec();
  // }

  // public async findOne(
  //   filter: FilterQuery<MediaFileDocument>,
  //   projection?: ProjectionType<MediaFileDocument> | null,
  //   options?: QueryOptions<MediaFileDocument> | null,
  // ) {
  //   if (_.isEmpty(filter)) {
  //     return null;
  //   }
  //   return await this.model.findOne(filter, projection, options).lean().exec();
  // }

  // public async findOneOrFail(
  //   filter: FilterQuery<MediaFileDocument>,
  //   projection?: ProjectionType<MediaFileDocument> | null,
  //   options?: QueryOptions<MediaFileDocument> | null,
  // ) {
  //   const findResult = await this.findOne(filter, projection, options);
  //   if (!findResult) {
  //     throw new NotFoundException({
  //       message: HttpErrorMessages['File does not exist.'],
  //     });
  //   }

  //   return findResult;
  // }

  // public async findMany(
  //   filter: FilterQuery<MediaFileDocument>,
  //   projection?: ProjectionType<MediaFileDocument> | null | undefined,
  //   options?: QueryOptions<MediaFileDocument> | null | undefined,
  // ) {
  //   return await this.model
  //     .find(filter, projection, {
  //       ...options,
  //       limit: APP_CONFIG.PAGINATION_LIMIT.MEDIA_FILES,
  //     })
  //     .lean()
  //     .exec();
  // }

  // public async updateOneById(
  //   _id: Types.ObjectId,
  //   updateQuery: UpdateQuery<MediaFile>,
  // ) {
  //   const updateResult = await this.model.updateOne({ _id }, updateQuery);

  //   return !!updateResult.modifiedCount;
  // }

  // public async deleteOneByIdAndUserId(
  //   _id: Types.ObjectId,
  //   _userId: Types.ObjectId,
  // ) {
  //   const deleteResult = await this.model.deleteOne({ _id, _userId });
  //   // TODO: Remove item from AWS S3
  //   return !!deleteResult.deletedCount;
  // }
}
