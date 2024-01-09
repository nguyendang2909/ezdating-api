import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

import { CommonConsumer } from '../../commons/consumers/common.consumer';
import { BULL_QUEUE_EVENTS } from '../../constants';
import { MessageModel } from '../../models';

@Processor({ name: BULL_QUEUE_EVENTS.MATCHES })
export class MatchesConsumer extends CommonConsumer {
  constructor(private readonly messageModel: MessageModel) {
    super();
  }

  private readonly logger = new Logger();

  @Process()
  async handle({ data: { matchId } }: Job<{ matchId: string }>) {
    try {
      await this.messageModel.deleteMany({
        _matchId: this.getObjectId(matchId),
      });
    } catch (err) {}
  }
}
