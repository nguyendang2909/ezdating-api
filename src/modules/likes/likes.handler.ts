import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

import { BULL_QUEUE_EVENTS } from '../../constants';

@Injectable()
export class LikesHandler {
  constructor(
    @InjectQueue(BULL_QUEUE_EVENTS.SENT_LIKE) private sentLikeQueue: Queue,
  ) {}

  afterSentLike() {
    this.sentLikeQueue.add({
      foo: 'bar',
    });
  }
}
