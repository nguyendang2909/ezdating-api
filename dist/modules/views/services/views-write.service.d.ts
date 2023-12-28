import { ApiWriteService } from '../../../commons';
import { ClientData } from '../../auth/auth.type';
import { MatchModel, ProfileModel, View, ViewModel } from '../../models';
import { SendViewDto } from '../dto';
export declare class ViewsWriteService extends ApiWriteService<View, SendViewDto> {
    private readonly viewModel;
    private readonly profileModel;
    private readonly matchModel;
    constructor(viewModel: ViewModel, profileModel: ProfileModel, matchModel: MatchModel);
    send(payload: SendViewDto, clientData: ClientData): Promise<View>;
    verifyNotSameUserById(userOne: string, userTwo: string): void;
}
