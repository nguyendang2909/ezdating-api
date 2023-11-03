import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

import { BULL_QUEUE_EVENTS } from '../../constants';

@Injectable()
export class MatchesPublisher {
  constructor(
    @InjectQueue(BULL_QUEUE_EVENTS.UNMATCHED) private unmatchedQueue: Queue,
  ) {}

  async publishUnmatched(matchId: string) {
    await this.unmatchedQueue.add({
      matchId,
    });
  }
}
