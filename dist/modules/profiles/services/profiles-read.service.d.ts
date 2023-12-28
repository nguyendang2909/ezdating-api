import { ApiReadService } from '../../../commons/services/api/api-read.base.service';
import { ClientData } from '../../auth/auth.type';
import { BasicProfile, Profile, ProfileModel } from '../../models';
import { CreateBasicProfileDto } from '../dto';
export declare class ProfilesReadService extends ApiReadService<BasicProfile | Profile, CreateBasicProfileDto> {
    protected readonly profileModel: ProfileModel;
    constructor(profileModel: ProfileModel);
    findOneById(id: string, _client: ClientData): Promise<Profile>;
}
