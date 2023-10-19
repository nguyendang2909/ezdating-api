import { InternalServerErrorException } from '@nestjs/common';
import {
  FilterQuery,
  HydratedDocument,
  ProjectionType,
  QueryOptions,
  Types,
} from 'mongoose';

import { APP_CONFIG } from '../../app.config';
import { HttpErrorMessages } from '../../commons/erros/http-error-messages.constant';

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
  public limitRecordsPerQuery: number = APP_CONFIG.PAGINATION_LIMIT.DEFAULT;

  public areObjectIdEqual(
    first: Types.ObjectId,
    second: Types.ObjectId,
  ): boolean {
    return first.toString() === second.toString();
  }

  async createOne(doc: Partial<TRawDocType>): Promise<THydratedDocumentType> {
    throw new InternalServerErrorException(
      HttpErrorMessages['Not implemented.'],
    );
  }

  async findOne(
    filter?: FilterQuery<any>,
    projection?: ProjectionType<any> | null,
    options?: QueryOptions<any> | null,
  ): Promise<any> {
    throw new InternalServerErrorException(
      HttpErrorMessages['Not implemented.'],
    );
  }

  async findOneOrFail(
    filter?: FilterQuery<any>,
    projection?: ProjectionType<any> | null,
    options?: QueryOptions<any> | null,
  ): Promise<any> {
    throw new InternalServerErrorException(
      HttpErrorMessages['Not implemented.'],
    );
  }

  async updateOneOrFail() {
    throw new InternalServerErrorException(
      HttpErrorMessages['Not implemented.'],
    );
  }

  async deleteOneOrFail() {
    throw new InternalServerErrorException(
      HttpErrorMessages['Not implemented.'],
    );
  }

  // public getObjectId(id: string): Types.ObjectId {
  //   return new Types.ObjectId(id);
  // }

  // public encodeCursor(str: string): string {
  //   return Buffer.from(str, 'utf-8').toString('base64');
  // }

  // public extractCursor(value?: string): string | undefined {
  //   if (!value) {
  //     return;
  //   }
  //   return Buffer.from(value, 'base64').toString('utf-8');
  // }

  // public getCursors({ next, prev }: GetCursors): PaginationCursors {
  //   return {
  //     next: !_.isNil(next) ? this.encodeCursor(next) : null,
  //     prev: !_.isNil(prev) ? this.encodeCursor(prev) : null,
  //   };
  // }
}
