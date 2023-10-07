import { BadRequestException } from '@nestjs/common';
import moment from 'moment';

import { HttpErrorMessages } from '../erros/http-error-messages.constant';
import { ApiService } from './api.service';

export class ApiCursorDateService extends ApiService {
  protected getCursor(_cursor?: string): Date | undefined {
    if (!_cursor) {
      return undefined;
    }
    const cursor = this.decodeToString(_cursor);
    const cursorValue = moment(cursor);
    if (!cursorValue.isValid()) {
      throw new BadRequestException(
        HttpErrorMessages['Input data was not correct.'],
      );
    }

    return cursorValue.toDate();
  }
}
