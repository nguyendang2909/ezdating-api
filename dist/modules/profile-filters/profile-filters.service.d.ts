import { ApiService } from '../../commons';
import { ClientData } from '../auth/auth.type';
import { ProfileFilterModel } from '../models';
import { UpdateProfileFilterDto } from './dto';
export declare class ProfileFiltersService extends ApiService {
    private readonly profileFilterModel;
    constructor(profileFilterModel: ProfileFilterModel);
    updateMe(payload: UpdateProfileFilterDto, client: ClientData): Promise<void>;
    getMe(client: ClientData): Promise<import("../models").ProfileFilter>;
}
