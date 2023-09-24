import { InternalServerErrorException } from '@nestjs/common';

import { APP_CONFIG } from '../app.config';
import { HttpErrorMessages } from './erros/http-error-messages.constant';
import { Pagination } from './types';

export class CommonService {
  public limitRecordsPerQuery = APP_CONFIG.PAGINATION_LIMIT.DEFAULT;

  public getPagination(data: any[]): Pagination {
    throw new InternalServerErrorException(
      HttpErrorMessages['Not implemented!'],
    );
  }

  public getPaginationByField(field: string, data: any[]): Pagination {
    const dataLength = data.length;

    if (!dataLength || dataLength < this.limitRecordsPerQuery) {
      return { _next: null };
    }

    const lastData = data[dataLength - 1];

    return {
      _next: lastData[field]?.toString() || null,
    };
  }
}
