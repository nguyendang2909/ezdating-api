import { ApiReadMeService } from '../../../commons/services/api/api-read-me.base.service';
import { ClientData } from '../../auth/auth.type';
import { User, UserModel } from '../../models';
export declare class UsersReadMeService extends ApiReadMeService<User> {
    private readonly userModel;
    constructor(userModel: UserModel);
    findOne(client: ClientData): Promise<User>;
}
