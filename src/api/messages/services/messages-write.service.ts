import { Injectable } from '@nestjs/common';

import { ApiBaseService } from '../../../commons';
import { ClientData } from '../../auth/auth.type';
import { MatchModel } from '../../../models/match.model';
import { ReadMessageDto } from '../dto';

@Injectable()
export class MessagesWriteService extends ApiBaseService {
  constructor(private readonly matchModel: MatchModel) {
    super();
  }

  public async read(payload: ReadMessageDto, client: ClientData) {
    const { _currentUserId } = this.getClient(client);
    await this.matchModel.updateOne(
      {
        _id: this.getObjectId(payload.matchId),
        lastMessage: {
          _id: this.getObjectId(payload.lastMessageId),
        },
        $or: [
          { _userOneId: _currentUserId, userOneRead: false },
          { _userOneId: _currentUserId, userTwoRead: false },
        ],
      },
      {
        $set: {
          userOneRead: true,
          userTwoRead: true,
        },
      },
    );
  }
}
