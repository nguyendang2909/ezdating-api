import { NotImplementedException } from '@nestjs/common';

import { ClientData } from '../../../modules/auth/auth.type';
import { ERROR_MESSAGES } from '../../messages';
import { DbBaseService } from '../db/db.base.service';

export class ApiBaseService extends DbBaseService {
  getClient(client: ClientData) {
    const { id: currentUserId } = client;
    const _currentUserId = this.getObjectId(currentUserId);
    return { currentUserId, _currentUserId };
  }

  throwNotImplemented(): any {
    throw new NotImplementedException(ERROR_MESSAGES['Not implemented']);
  }
}
