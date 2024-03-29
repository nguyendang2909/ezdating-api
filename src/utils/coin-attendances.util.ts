import { Injectable } from '@nestjs/common';

import { WEEKLY_COINS, WEEKLY_COINS_LENGTH } from '../constants';
import { CoinAttendance } from '../models';
import { BaseUtil } from './bases/base.util';

@Injectable()
export class CoinAttendancesUtil extends BaseUtil {
  getReceivedDayIndex(value: number) {
    return WEEKLY_COINS.findIndex((item) => item === value);
  }

  getNextReceiveDayIndex(lastReceivedDayIndex: number) {
    return lastReceivedDayIndex !== WEEKLY_COINS_LENGTH - 1
      ? lastReceivedDayIndex + 1
      : 0;
  }

  getNextReceivedDayIndexFromValue(value: number) {
    const receivedDayIndex = this.getReceivedDayIndex(value);
    return receivedDayIndex !== WEEKLY_COINS_LENGTH - 1
      ? receivedDayIndex + 1
      : 0;
  }

  getValueFromReceivedDayIndex(receivedDayIndex: number) {
    return WEEKLY_COINS[receivedDayIndex] || 0;
  }

  getByStartDays(documents: CoinAttendance[]) {
    let flag = false;
    const findResults = [];
    for (const document of documents) {
      if (flag) {
        findResults.push(document);
      } else if (document.receivedDateIndex === 0) {
        flag = true;
        findResults.push(document);
      }
    }
    return findResults;
  }
}
