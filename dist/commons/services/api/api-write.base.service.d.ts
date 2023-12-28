import { ClientData } from '../../../modules/auth/auth.type';
import { ApiBaseService } from './api.base.service';
export declare class ApiWriteService<Entity extends object, CreatePayload = Record<string, any>, UpdatePayload = Record<string, any>> extends ApiBaseService {
    createOne(payload: CreatePayload, client: ClientData | undefined): Promise<Entity>;
    updateOneById(id: string, payload: UpdatePayload, client: ClientData | undefined): Promise<void>;
}
