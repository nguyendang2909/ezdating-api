import { BadRequestException, Injectable } from '@nestjs/common';
import moment from 'moment';

import { HttpErrorMessages } from '../../commons/erros/http-error-messages.constant';
import {
  USER_STATUSES,
  WEEKLY_COINS,
  WEEKLY_COINS_LENGTH,
} from '../../constants';
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

  public async deactivate(clientData: ClientData) {
    const _currentUserId = this.getObjectId(clientData.id);
    await this.userModel.updateOneById(_currentUserId, {
      $set: {
        status: USER_STATUSES.DEACTIVATED,
      },
    });
    // Move profile
  }

  public async takeAttendance(
    clientData: ClientData,
  ): Promise<CoinAttendanceDocument> {
    const { id: currentUserId } = clientData;
    const _currentUserId = this.getObjectId(currentUserId);
    const todayDate = moment().startOf('date').toDate();

    const lastCoinAttendance = await this.coinAttendanceModel.model
      .findOne({
        _userId: _currentUserId,
      })
      .lean()
      .exec();

    if (!lastCoinAttendance) {
      // TODO: transaction
      const firstCoinAttendance = await this.coinAttendanceModel.createOne({
        _userId: _currentUserId,
        receivedDate: todayDate,
        value: WEEKLY_COINS[0],
        receivedDateIndex: 0,
      });

      await this.userModel.updateOne(
        { _id: _currentUserId },
        {
          $inc: {
            coins: WEEKLY_COINS[0],
          },
        },
      );

      return firstCoinAttendance;
    }

    if (moment(lastCoinAttendance.receivedDate).isSame(moment(todayDate))) {
      throw new BadRequestException({
        message: HttpErrorMessages['You already got attendance today'],
      });
    }

    const lastReceivedDayIndex = WEEKLY_COINS.findIndex(
      (item) => item === lastCoinAttendance.value,
    );
    const newReceiveDayIndex =
      lastReceivedDayIndex !== WEEKLY_COINS_LENGTH - 1
        ? lastReceivedDayIndex + 1
        : 0;

    const createResult = await this.coinAttendanceModel.createOne({
      _userId: _currentUserId,
      receivedDate: todayDate,
      receivedDateIndex: newReceiveDayIndex,
      value: WEEKLY_COINS[newReceiveDayIndex || 0],
    });

    return createResult;
  }
}
