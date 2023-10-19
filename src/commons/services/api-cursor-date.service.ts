import { BadRequestException } from '@nestjs/common';
import moment from 'moment';

import { HttpErrorMessages } from '../erros/http-error-messages.constant';
import { ApiService } from './api.service';

export class ApiCursorDateService extends ApiService {
  protected getCursor(_cursor: string): Date {
    const cursor = moment(this.decodeToString(_cursor));
    if (!cursor.isValid()) {
      throw new BadRequestException(
        HttpErrorMessages['Input data was not correct'],
      );
    }

    return cursor.toDate();
  }
}
