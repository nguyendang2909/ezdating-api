import { ClientData } from '../../../modules/auth/auth.type';
import { ApiBaseService } from './api.base.service';
export declare class ApiWriteMeService<TRawDocType extends object, CreatePayload = object, UpdatePayload = object> extends ApiBaseService {
    updateOne(payload: UpdatePayload, client: ClientData): Promise<void>;
}
