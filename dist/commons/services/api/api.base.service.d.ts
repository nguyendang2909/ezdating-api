import mongoose from 'mongoose';
import { ClientData } from '../../../modules/auth/auth.type';
import { CommonService } from '../common.service';
export declare class ApiBaseService extends CommonService {
    getObjectId(id: string): mongoose.Types.ObjectId;
    getClient(client: ClientData): {
        currentUserId: string;
        _currentUserId: mongoose.Types.ObjectId;
    };
    throwNotImplemented(): any;
}
