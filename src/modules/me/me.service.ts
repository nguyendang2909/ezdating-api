import { BadRequestException, Injectable } from '@nestjs/common';
import moment from 'moment';

import { ERROR_MESSAGES } from '../../commons/messages/error-messages.constant';
import { WEEKLY_COINS, WEEKLY_COINS_LENGTH } from '../../constants';
import { ClientData } from '../auth/auth.type';
import { ProfileModel } from '../models';
import { CoinAttendanceModel } from '../models/coin-attendance.model';
import { MatchModel } from '../models/match.model';
import { CoinAttendanceDocument } from '../models/schemas/coin-attendance.schema';
import { UserModel } from '../models/user.model';
import { UsersCommonService } from '../users/users.common.service';

@Injectable()
export class MeService extends UsersCommonService {
  constructor(
    private readonly userModel: UserModel,
    // private readonly stateModel: StateModel,
    private readonly coinAttendanceModel: CoinAttendanceModel,
    // private readonly countryModel: CountryModel,
    private readonly matchModel: MatchModel,
    private readonly profileModel: ProfileModel,
  ) {
    super();
  }

  // public async deactivate(clientData: ClientData) {
  //   const _currentUserId = this.getObjectId(clientData.id);
  //   await this.userModel.updateOneById(_currentUserId, {
  //     $set: {
  //       status: USER_STATUSES.DEACTIVATED,
  //     },
  //   });
  //   const profile = await this.profileModel.findOne({
  //     _id: _currentUserId,
  //   });
  //   if (profile) {
  //     if (profile.mediaFiles) {
  //       for (const mediaFile of profile.mediaFiles) {
  //       }
  //     }
  //   }

  //   // Move profile
  // }

 
}
