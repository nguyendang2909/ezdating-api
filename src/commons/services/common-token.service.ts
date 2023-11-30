import { InternalServerErrorException } from '@nestjs/common';

import { TokenSignPayload } from '../../modules/auth/auth.type';
import { User } from '../../modules/models';
import { ERROR_MESSAGES } from '../messages';
import { CommonService } from './common.service';

export class CommonTokensService extends CommonService {
  constructor() {
    super();
  }

  protected readonly SECRET_KEY: string = '';

  public sign(payload: TokenSignPayload): string {
    throw new InternalServerErrorException(ERROR_MESSAGES['Not implemented']);
  }

  public signFromUser(user: User): string {
    throw new InternalServerErrorException(ERROR_MESSAGES['Not implemented']);
  }

  public verify(token: string): TokenSignPayload {
    throw new InternalServerErrorException(ERROR_MESSAGES['Not implemented']);
  }
}
