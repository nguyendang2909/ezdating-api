import { ApiWriteService } from '../../../commons';
import { ClientData } from '../../auth/auth.type';
import { MatchModel, ProfileModel, View, ViewModel } from '../../models';
import { SendLikeDto } from '../dto/send-like.dto';
import { LikesHandler } from '../likes.handler';
export declare class LikesWriteService extends ApiWriteService<View, SendLikeDto> {
    private readonly matchModel;
    private readonly viewModel;
    private readonly profileModel;
    private readonly likesHandler;
    constructor(matchModel: MatchModel, viewModel: ViewModel, profileModel: ProfileModel, likesHandler: LikesHandler);
    createOne(payload: SendLikeDto, clientData: ClientData): Promise<View>;
    verifyNotSameUserById(userOne: string, userTwo: string): void;
}
