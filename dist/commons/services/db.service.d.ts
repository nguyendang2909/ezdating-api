import { Types } from 'mongoose';
import { ClientData } from '../../modules/auth/auth.type';
import { CommonService } from './common.service';
export declare class DbService extends CommonService {
    protected limitRecordsPerQuery: number;
    getObjectId(id: string): Types.ObjectId;
    getClient(client: ClientData): {
        currentUserId: string;
        _currentUserId: Types.ObjectId;
    };
}
