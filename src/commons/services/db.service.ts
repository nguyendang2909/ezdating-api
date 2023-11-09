import { Types } from 'mongoose';

import { APP_CONFIG } from '../../app.config';
import { ClientData } from '../../modules/auth/auth.type';
import { CommonService } from './common.service';

export class DbService extends CommonService {
  protected limitRecordsPerQuery = APP_CONFIG.PAGINATION_LIMIT.DEFAULT;

  public getObjectId(id: string): Types.ObjectId {
    return new Types.ObjectId(id);
  }

  getClient(client: ClientData) {
    const { id: currentUserId } = client;
    const _currentUserId = this.getObjectId(currentUserId);

    return { currentUserId, _currentUserId };
  }
}
