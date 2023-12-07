import { Types } from 'mongoose';

import { ApiService } from './api.service';

export class ApiCursorObjectIdService extends ApiService {
  protected getCursor(_cursor: string): Types.ObjectId {
    return this.getObjectId(this.decodeToString(_cursor));
  }
}
