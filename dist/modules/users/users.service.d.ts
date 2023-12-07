import { ApiService } from '../../commons/services/api.service';
import { ClientData } from '../auth/auth.type';
import { ProfileModel, User } from '../models';
import { UserModel } from '../models/user.model';
export declare class UsersService extends ApiService {
    private readonly userModel;
    private readonly profileModel;
    constructor(userModel: UserModel, profileModel: ProfileModel);
    findMe(client: ClientData): Promise<User>;
}
