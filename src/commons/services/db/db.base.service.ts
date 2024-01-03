import mongoose from 'mongoose';

import { CommonService } from '../common.service';

export class DbBaseService extends CommonService {
  public getObjectId(id: string): mongoose.Types.ObjectId {
    return new mongoose.Types.ObjectId(id);
  }
}
