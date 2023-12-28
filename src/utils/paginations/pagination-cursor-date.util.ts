import { BadRequestException, Injectable } from '@nestjs/common';
import moment from 'moment';

import { ERROR_MESSAGES } from '../../commons/messages';
import { PaginationBaseUtil } from '../bases/pagination-base.util';

@Injectable()
export class PaginationCursorDateUtil extends PaginationBaseUtil {
  public getCursor(_cursor: string): Date {
    const cursor = moment(this.decode(_cursor));
    if (!cursor.isValid()) {
      throw new BadRequestException(
        ERROR_MESSAGES['Input data was not correct'],
      );
    }
    return cursor.toDate();
  }
}
