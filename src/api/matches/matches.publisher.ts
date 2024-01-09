import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

import { BULL_QUEUE_EVENTS, BULL_QUEUE_JOBS } from '../../constants';

@Injectable()
export class MatchesPublisher {
  constructor(
    @InjectQueue(BULL_QUEUE_EVENTS.MATCHES) private unmatchedQueue: Queue,
  ) {}

  async publishUnmatched(matchId: string) {
    await this.unmatchedQueue.add(BULL_QUEUE_JOBS.MATCHES.UNMATCHED, {
      matchId,
    });
  }
}
