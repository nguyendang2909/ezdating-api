import { Queue } from 'bull';
export declare class LikesPublisher {
    private sentLikeQueue;
    constructor(sentLikeQueue: Queue);
    afterSentLike(): void;
}
