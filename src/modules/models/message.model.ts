import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CommonModel } from './bases/common-model';
import { Message, MessageDocument } from './schemas/message.schema';
import { UserModel } from './user.model';

@Injectable()
export class MessageModel extends CommonModel<Message> {
  constructor(
    @InjectModel(Message.name)
    readonly model: Model<MessageDocument>,
    private readonly userModel: UserModel,
  ) {
    super();
  }
}
