import { ClientData } from '../../../modules/auth/auth.type';
import { CommonModel } from '../../../modules/models';
import { ApiBaseService } from './api.base.service';
export declare class ApiWriteMeService<TRawDocType extends object, CreatePayload = object, UpdatePayload = object> extends ApiBaseService {
    protected readonly model: CommonModel<TRawDocType>;
    constructor(model: CommonModel<TRawDocType>);
    updateOne(payload: UpdatePayload, client: ClientData): Promise<void>;
}
