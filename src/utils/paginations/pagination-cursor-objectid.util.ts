import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';

import { PaginationBaseUtil } from '../bases/pagination-base.util';

@Injectable()
export class PaginationCursorObjectIdUtil extends PaginationBaseUtil {
  public getCursor(_cursor: string): any {
    return new mongoose.Types.ObjectId(this.decode(_cursor));
  }
}
