import { ApiWriteMeService } from '../../../commons/services/api/api-update-me.base.service';
import { ProfilesUtil } from '../../../utils';
import { ClientData } from '../../auth/auth.type';
import { Profile, ProfileModel, StateModel } from '../../models';
import { UpdateMyProfileDto } from '../dto';
export declare class ProfilesWriteMeService extends ApiWriteMeService<Profile, undefined, UpdateMyProfileDto> {
    private readonly profileModel;
    private readonly stateModel;
    private readonly profilesUtil;
    constructor(profileModel: ProfileModel, stateModel: StateModel, profilesUtil: ProfilesUtil);
    updateOne(payload: UpdateMyProfileDto, client: ClientData): Promise<void>;
}
