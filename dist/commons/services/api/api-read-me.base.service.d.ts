import { ClientData } from '../../../modules/auth/auth.type';
import { ApiBaseService } from './api.base.service';
export declare class ApiReadMeService<Response> extends ApiBaseService {
    findOne(client: ClientData): Promise<Response>;
}
