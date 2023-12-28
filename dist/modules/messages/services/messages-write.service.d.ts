import { ApiBaseService } from '../../../commons';
import { ClientData } from '../../auth/auth.type';
import { MatchModel } from '../../models/match.model';
import { ReadMessageDto } from '../dto';
export declare class MessagesWriteService extends ApiBaseService {
    private readonly matchModel;
    constructor(matchModel: MatchModel);
    read(payload: ReadMessageDto, client: ClientData): Promise<void>;
}
