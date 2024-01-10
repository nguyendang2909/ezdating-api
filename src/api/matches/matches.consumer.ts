import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import mongoose from 'mongoose';

import { BULL_QUEUE_EVENTS } from '../../constants';
import { MessageModel } from '../../models';

@Processor({ name: BULL_QUEUE_EVENTS.MATCHES })
export class MatchesConsumer {
  constructor(private readonly messageModel: MessageModel) {}

  private readonly logger = new Logger();

  @Process()
  async handle({ data: { matchId } }: Job<{ matchId: string }>) {
    try {
      await this.messageModel.deleteMany({
        _matchId: new mongoose.Types.ObjectId(matchId),
      });
    } catch (err) {}
  }
}
