import { TokenSignPayload } from '../../modules/auth/auth.type';
import { User } from '../../modules/models';
import { CommonService } from './common.service';
export declare class CommonTokensService extends CommonService {
    constructor();
    protected readonly SECRET_KEY: string;
    sign(payload: TokenSignPayload): string;
    signFromUser(user: User): string;
    verify(token: string): TokenSignPayload;
}
