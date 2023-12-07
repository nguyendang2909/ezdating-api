import { Job } from 'bull';
import { CommonConsumer } from '../../commons/consumers/common.consumer';
import { MessageModel } from '../models';
export declare class MatchesConsumer extends CommonConsumer {
    private readonly messageModel;
    constructor(messageModel: MessageModel);
    private readonly logger;
    handle({ data: { matchId } }: Job<{
        matchId: string;
    }>): Promise<void>;
}
