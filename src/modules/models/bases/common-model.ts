import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import _ from 'lodash';
import {
  AnyObject,
  Document,
  FilterQuery,
  HydratedDocument,
  IfAny,
  Model,
  PipelineStage,
  ProjectionType,
  QueryOptions,
  Require_id,
  ReturnsNewDoc,
  Types,
  UpdateQuery,
  UpdateWithAggregationPipeline,
  UpdateWriteOpResult,
} from 'mongoose';

import { ERROR_MESSAGES } from '../../../commons/messages';
import { ErrorMessage } from '../../../types';

export class CommonModel<
  TRawDocType,
  TQueryHelpers = {},
  TInstanceMethods = {},
  TVirtuals = {},
  THydratedDocumentType = HydratedDocument<
    TRawDocType,
    TVirtuals & TInstanceMethods,
    TQueryHelpers
  >,
  TSchema = any,
> {
  protected model: Model<HydratedDocument<TRawDocType>>;
  protected notFoundMessage: ErrorMessage =
    ERROR_MESSAGES['Document does not exist'];
  protected conflictMessage: string = ERROR_MESSAGES['Document already exists'];
  protected deleteFailMessage: ErrorMessage =
    ERROR_MESSAGES['Delete failed. Please try again.'];
  protected updateFailMessage: ErrorMessage =
    ERROR_MESSAGES['Update failed. Please try again.'];

  public areObjectIdEqual(
    first: Types.ObjectId,
    second: Types.ObjectId,
  ): boolean {
    return first.toString() === second.toString();
  }

  async aggregate(
    pipeline: PipelineStage[],
  ): Promise<Array<TRawDocType & { _id: Types.ObjectId }>> {
    return await this.model.aggregate(pipeline).exec();
  }

  async aggregateExplain(pipeline: PipelineStage[]): Promise<AnyObject> {
    return await this.model.aggregate(pipeline).explain();
  }

  async createOne(doc: Partial<TRawDocType>) {
    const createResult = await this.model.create(doc);
    return createResult.toJSON();
  }

  findMany(
    filter: FilterQuery<TRawDocType>,
    projection?: ProjectionType<TRawDocType> | null | undefined,
    options?: QueryOptions<TRawDocType> | null | undefined,
  ) {
    return this.model
      .find(filter, projection, {
        lean: true,
        ...options,
      })
      .exec();
  }

  async findOne(
    filter: FilterQuery<TRawDocType>,
    projection?: ProjectionType<TRawDocType> | null,
    options?: QueryOptions<TRawDocType> | null,
  ): Promise<TRawDocType | null> {
    if (_.isEmpty(filter)) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.model
      .findOne(filter, projection, { lean: true, ...options })
      .exec();
  }

  async findOneOrFail(
    filter: FilterQuery<TRawDocType>,
    projection?: ProjectionType<TRawDocType> | null,
    options?: QueryOptions<TRawDocType> | null,
  ) {
    const findResult = await this.findOne(filter, projection, options);
    if (!findResult) {
      throw new NotFoundException(this.notFoundMessage);
    }
    return findResult;
  }

  async findOneAndFail(
    filter: FilterQuery<TRawDocType>,
    projection?: ProjectionType<TRawDocType> | null,
    options?: QueryOptions<TRawDocType> | null,
  ) {
    const findResult = await this.findOne(filter, projection, options);
    this.verifyNotExist(findResult);
  }

  async findOneById(
    _id: Types.ObjectId,
    projection?: ProjectionType<TRawDocType> | null,
    options?: QueryOptions<TRawDocType> | null,
  ): Promise<TRawDocType | null> {
    return await this.findOne({ _id }, projection, options);
  }

  async findOneOrFailById(
    _id: Types.ObjectId,
    projection?: ProjectionType<TRawDocType> | null,
    options?: QueryOptions<TRawDocType> | null,
  ): Promise<TRawDocType> {
    return await this.findOneOrFail({ _id }, projection, options);
  }

  async updateOne(
    filter: FilterQuery<TRawDocType>,
    update: UpdateQuery<TRawDocType>,
    options?: QueryOptions<TRawDocType> | null,
  ): Promise<UpdateWriteOpResult> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    return await this.model.updateOne(filter, update, options);
  }

  async updateOneById(
    _id: Types.ObjectId,
    update: UpdateQuery<TRawDocType> | UpdateWithAggregationPipeline,
    options?: QueryOptions<TRawDocType> | null,
  ): Promise<UpdateWriteOpResult> {
    return await this.updateOne({ _id }, update, options);
  }

  async updateOneOrFail(
    filter: FilterQuery<TRawDocType>,
    update: UpdateQuery<TRawDocType> | UpdateWithAggregationPipeline,
    options?: QueryOptions<TRawDocType> | null,
  ): Promise<void> {
    const updateResult = await this.updateOne(filter, update, options);
    this.verifyUpdateSuccess(updateResult);
  }

  async updateOneOrFailById(
    _id: Types.ObjectId,
    update: UpdateQuery<TRawDocType> | UpdateWithAggregationPipeline,
    options?: QueryOptions<TRawDocType> | null,
  ): Promise<void> {
    const updateResult = await this.updateOneById(_id, update, options);
    this.verifyUpdateSuccess(updateResult);
  }

  async findOneAndUpdate(
    filter: FilterQuery<TRawDocType>,
    update: UpdateQuery<
      IfAny<
        TRawDocType,
        any,
        Document<unknown, {}, TRawDocType> & Require_id<TRawDocType>
      >
    >,
    options?:
      | (QueryOptions<TRawDocType> & {
          upsert?: true;
        } & Partial<ReturnsNewDoc> & {
            rawResult?: true;
          })
      | null,
  ) {
    return await this.model
      .findOneAndUpdate(filter, update, { lean: true, ...options })
      .exec();
  }

  async findOneAndUpdateById(
    _id: Types.ObjectId,
    update: UpdateQuery<
      IfAny<
        TRawDocType,
        any,
        Document<unknown, {}, TRawDocType> & Require_id<TRawDocType>
      >
    >,
    options?:
      | (QueryOptions<TRawDocType> & {
          upsert?: true;
        } & Partial<ReturnsNewDoc> & {
            rawResult?: true;
          })
      | null,
  ) {
    return await this.model
      .findOneAndUpdate({ _id }, update, { lean: true, ...options })
      .exec();
  }

  async deleteMany(
    filter: FilterQuery<TRawDocType>,
    options?: QueryOptions<TRawDocType>,
  ) {
    return await this.model.deleteMany(filter, options);
  }

  async deleteOne(
    filter: FilterQuery<TRawDocType>,
    options?: QueryOptions<TRawDocType>,
  ) {
    return await this.model.deleteOne(filter, options).exec();
  }

  // async deleteOneById(
  //   _id: Types.ObjectId,
  //   options?: QueryOptions<TRawDocType>,
  // ) {
  //   return await this.deleteOne({ _id }, options);
  // }

  async deleteOneOrFail(
    filter: FilterQuery<TRawDocType>,
    options?: QueryOptions<TRawDocType>,
  ) {
    const deleteResult = await this.deleteOne(filter, options);
    this.verifyDeleteSuccess(deleteResult);
  }

  // async deleteOneOrFailById(
  //   _id: Types.ObjectId,
  //   options?: QueryOptions<TRawDocType>,
  // ) {
  //   const deleteResult = await this.deleteOneById(_id, options);
  //   this.verifyDeleteSuccess(deleteResult);
  // }

  verifyExist(e: any) {
    if (!e) {
      throw new NotFoundException(this.notFoundMessage);
    }
    return e;
  }

  verifyNotExist(e: any) {
    if (e) {
      throw new ConflictException(this.conflictMessage);
    }
  }

  verifyDeleteSuccess(deleteResult: any) {
    if (!deleteResult.deletedCount) {
      throw new BadRequestException(this.deleteFailMessage);
    }
  }

  verifyUpdateSuccess(updateResult: any) {
    if (!updateResult.modifiedCount) {
      throw new BadRequestException(this.updateFailMessage);
    }
  }
}
