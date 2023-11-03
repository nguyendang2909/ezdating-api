import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import { CommonConsumer } from '../../../commons/consumers/common.consumer';
import { BULL_QUEUE_EVENTS } from '../../../constants';
import { MessageModel } from '../../models';

@Processor(BULL_QUEUE_EVENTS.UNMATCHED)
export class UnmatchConsumer extends CommonConsumer {
  constructor(private readonly messageModel: MessageModel) {
    super();
  }

  @Process()
  async handle({ data: { matchId } }: Job<{ matchId: string }>) {
    try {
      await this.messageModel.deleteMany({
        _matchId: this.getObjectId(matchId),
      });
    } catch (err) {}
  }
}
