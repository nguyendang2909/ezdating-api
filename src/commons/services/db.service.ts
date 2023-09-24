import { Types } from 'mongoose';

import { APP_CONFIG } from '../../app.config';
import { CommonService } from './common.service';

export class DbService extends CommonService {
  public limitRecordsPerQuery = APP_CONFIG.PAGINATION_LIMIT.DEFAULT;

  public getObjectId(id: string): Types.ObjectId {
    return new Types.ObjectId(id);
  }
}
