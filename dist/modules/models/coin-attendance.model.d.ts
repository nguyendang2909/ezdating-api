import { Model } from 'mongoose';
import { CommonModel } from './bases/common-model';
import { CoinAttendance, CoinAttendanceDocument } from './schemas/coin-attendance.schema';
export declare class CoinAttendanceModel extends CommonModel<CoinAttendance> {
    readonly model: Model<CoinAttendanceDocument>;
    constructor(model: Model<CoinAttendanceDocument>);
    getReceivedDayIndex(value: number): number;
    getNextReceiveDayIndex(lastReceivedDayIndex: number): number;
    getNextReceivedDayIndexFromValue(value: number): number;
    getValueFromReceivedDayIndex(receivedDayIndex: number): 20 | 10 | 40 | 70 | 110 | 160 | 220;
    getByStartDays(documents: CoinAttendance[]): CoinAttendance[];
}
