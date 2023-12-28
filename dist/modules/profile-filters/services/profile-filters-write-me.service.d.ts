import { ApiWriteMeService } from '../../../commons/services/api/api-update-me.base.service';
import { ClientData } from '../../auth/auth.type';
import { ProfileFilter, ProfileFilterModel } from '../../models';
import { UpdateProfileFilterDto } from '../dto';
export declare class ProfileFiltersWriteMeService extends ApiWriteMeService<ProfileFilter> {
    private readonly profileFilterModel;
    constructor(profileFilterModel: ProfileFilterModel);
    updateOne(payload: UpdateProfileFilterDto, client: ClientData): Promise<void>;
}
