import { NotImplementedException } from '@nestjs/common';
import mongoose from 'mongoose';

import { ClientData } from '../../../modules/auth/auth.type';
import { ERROR_MESSAGES } from '../../messages';
import { CommonService } from '../common.service';

export class ApiBaseService extends CommonService {
  public getObjectId(id: string): mongoose.Types.ObjectId {
    return new mongoose.Types.ObjectId(id);
  }

  getClient(client: ClientData) {
    const { id: currentUserId } = client;
    const _currentUserId = this.getObjectId(currentUserId);
    return { currentUserId, _currentUserId };
  }

  throwNotImplemented(): any {
    throw new NotImplementedException(ERROR_MESSAGES['Not implemented']);
  }
}
