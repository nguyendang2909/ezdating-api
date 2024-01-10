import { BadRequestException, Injectable } from '@nestjs/common';

import { ERROR_MESSAGES } from '../commons';
import { User } from '../models';
import { BaseUtil } from './bases/base.util';

@Injectable()
export class UsersUtil extends BaseUtil {
  public verifyCanBlock(user: User) {
    if (user._blockedIds && user._blockedIds?.length >= 100) {
      throw new BadRequestException(
        ERROR_MESSAGES['You can only block maximum 100 users'],
      );
    }
  }

  public verifyCanUnblock(currentUser: User, targetUser: User) {
    if (
      !currentUser._blockedIds
        ?.map((e) => e.toString())
        .includes(targetUser._id.toString()) &&
      !targetUser._blockedByIds
        ?.map((e) => e.toString())
        .includes(targetUser._id.toString())
    ) {
      throw new BadRequestException();
    }
  }
}
