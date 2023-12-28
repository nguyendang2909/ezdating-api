import { ApiReadMeService } from '../../../commons/services/api/api-read-me.base.service';
import { ClientData } from '../../auth/auth.type';
import { BasicProfile, BasicProfileModel, Profile, ProfileModel } from '../../models';
export declare class ProfilesReadMeService extends ApiReadMeService<Profile | BasicProfile> {
    private readonly profileModel;
    private readonly basicProfileModel;
    constructor(profileModel: ProfileModel, basicProfileModel: BasicProfileModel);
    findOne(client: ClientData): Promise<Profile | BasicProfile>;
}
