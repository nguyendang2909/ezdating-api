import { Injectable } from '@nestjs/common';
import moment from 'moment';
import mongoose from 'mongoose';

import { ApiBaseService } from '../../commons';
import { WEEKLY_COINS } from '../../constants';
import { CoinAttendance, CoinAttendanceModel, UserModel } from '../../models';
import { WeeklyCoin } from '../../types';
import { CoinAttendancesUtil } from '../../utils';
import { ClientData } from '../auth/auth.type';

@Injectable()
export class CoinsService extends ApiBaseService {
  constructor(
    private readonly coinAttendanceModel: CoinAttendanceModel,
    private readonly userModel: UserModel,
    private readonly coinAttendancesUtil: CoinAttendancesUtil,
  ) {
    super();
  }

  public async findManyAttendances(client: ClientData) {
    const { _currentUserId } = this.getClient(client);
    const newestAttendance = await this.takeAttendance(_currentUserId).catch(
      () => {
        return undefined;
      },
    );
    const attendances = await this.coinAttendanceModel.findMany(
      {},
      {},
      {
        limit: newestAttendance
          ? newestAttendance.data.receivedDateIndex + 1
          : 7,
      },
    );
    return {
      isReceivedAttendance: !!newestAttendance,
      data: newestAttendance
        ? attendances
        : this.coinAttendancesUtil.getByStartDays(attendances),
    };
  }

  public async takeAttendance(
    _currentUserId: mongoose.Types.ObjectId,
  ): Promise<{ data: CoinAttendance; isReceivedAttendance: boolean }> {
    const todayDate = moment().startOf('date').toDate();
    const lastCoinAttendance = await this.coinAttendanceModel.findOne({
      _userId: _currentUserId,
    });
    if (!lastCoinAttendance) {
      return {
        isReceivedAttendance: true,
        data: await this.createDailyAttendance({
          _userId: _currentUserId,
          receivedDate: todayDate,
          value: WEEKLY_COINS[0],
          receivedDateIndex: 0,
        }),
      };
    }
    if (
      moment(lastCoinAttendance.receivedDate).isSameOrAfter(moment(todayDate))
    ) {
      return { data: lastCoinAttendance, isReceivedAttendance: false };
    }
    const nextReceivedDayIndex =
      this.coinAttendancesUtil.getNextReceivedDayIndexFromValue(
        lastCoinAttendance.value,
      );
    return {
      isReceivedAttendance: true,
      data: await this.createDailyAttendance({
        _userId: _currentUserId,
        receivedDate: todayDate,
        receivedDateIndex: nextReceivedDayIndex,
        value:
          this.coinAttendancesUtil.getValueFromReceivedDayIndex(
            nextReceivedDayIndex,
          ),
      }),
    };
  }

  async createDailyAttendance({
    _userId,
    receivedDate,
    value,
    receivedDateIndex,
  }: {
    _userId: mongoose.Types.ObjectId;
    receivedDate: Date;
    receivedDateIndex: number;
    value: WeeklyCoin;
  }) {
    const coinAttendance = await this.coinAttendanceModel.createOne({
      _userId,
      receivedDate,
      value,
      receivedDateIndex,
    });
    await this.userModel.updateOne(
      { _id: _userId },
      { $inc: { coins: value } },
    );
    return coinAttendance;
  }
}
