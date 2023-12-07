import { Types } from 'mongoose';
import { ApiService } from './api.service';
export declare class ApiCursorObjectIdService extends ApiService {
    protected getCursor(_cursor: string): Types.ObjectId;
}
