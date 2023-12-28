import mongoose from 'mongoose';
import { ApiBaseService } from '../../commons';
import { WeeklyCoin } from '../../types';
import { ClientData } from '../auth/auth.type';
import { CoinAttendance, CoinAttendanceModel, UserModel } from '../models';
export declare class CoinsService extends ApiBaseService {
    private readonly coinAttendanceModel;
    private readonly userModel;
    constructor(coinAttendanceModel: CoinAttendanceModel, userModel: UserModel);
    findManyAttendances(client: ClientData): Promise<{
        isReceivedAttendance: boolean;
        data: CoinAttendance[];
    }>;
    takeAttendance(_currentUserId: mongoose.Types.ObjectId): Promise<{
        data: CoinAttendance;
        isReceivedAttendance: boolean;
    }>;
    createDailyAttendance({ _userId, receivedDate, value, receivedDateIndex, }: {
        _userId: mongoose.Types.ObjectId;
        receivedDate: Date;
        receivedDateIndex: number;
        value: WeeklyCoin;
    }): Promise<mongoose.FlattenMaps<mongoose.Document<unknown, {}, CoinAttendance> & CoinAttendance & Required<{
        _id: mongoose.Types.ObjectId;
    }>>>;
}
