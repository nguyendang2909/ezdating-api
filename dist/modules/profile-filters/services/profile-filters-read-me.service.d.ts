import { ApiReadMeService } from '../../../commons/services/api/api-read-me.base.service';
import { ClientData } from '../../auth/auth.type';
import { ProfileFilter, ProfileFilterModel } from '../../models';
export declare class ProfileFiltersReadMeService extends ApiReadMeService<ProfileFilter> {
    private readonly profileFilterModel;
    constructor(profileFilterModel: ProfileFilterModel);
    findOne(client: ClientData): Promise<ProfileFilter>;
}
