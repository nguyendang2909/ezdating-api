import { Queue } from 'bull';
export declare class MatchesPublisher {
    private unmatchedQueue;
    constructor(unmatchedQueue: Queue);
    publishUnmatched(matchId: string): Promise<void>;
}
