import { BadRequestException, Injectable } from '@nestjs/common';
import moment from 'moment';

import { ApiService } from '../../commons';
import { ERROR_MESSAGES } from '../../commons/messages';
import { WEEKLY_COINS, WEEKLY_COINS_LENGTH } from '../../constants';
import { ClientData } from '../auth/auth.type';
import { CoinAttendance, CoinAttendanceModel, UserModel } from '../models';

@Injectable()
export class CoinsService extends ApiService {
  constructor(
    private readonly coinAttendanceModel: CoinAttendanceModel,
    private readonly userModel: UserModel,
  ) {
    super();
  }

  public async takeAttendance(clientData: ClientData): Promise<CoinAttendance> {
    const { id: currentUserId } = clientData;
    const _currentUserId = this.getObjectId(currentUserId);
    const todayDate = moment().startOf('date').toDate();
    const lastCoinAttendance = await this.coinAttendanceModel.findOne({
      _userId: _currentUserId,
    });
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
        message: ERROR_MESSAGES['You already got attendance today'],
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
