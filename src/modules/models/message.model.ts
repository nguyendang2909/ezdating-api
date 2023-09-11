import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { MongoDocument } from '../../commons/types';
import { CommonModel } from './common-model';
import { Message } from './schemas/message.schema';
import { UserModel } from './user.model';

@Injectable()
export class MessageModel extends CommonModel {
  constructor(
    @InjectModel(Message.name)
    public readonly model: Model<MongoDocument<Message>>,
    private readonly userModel: UserModel,
  ) {
    super();
  }

  // public async createOne(entity: Partial<Message>) {
  //   const createResult = await this.model.create(entity);

  //   return createResult.toJSON();
  // }

  // public async findOne(
  //   filter: FilterQuery<MessageDocument>,
  //   projection?: ProjectionType<MessageDocument> | null,
  //   options?: QueryOptions<MessageDocument> | null,
  // ): Promise<Message | null> {
  //   if (_.isEmpty(filter)) {
  //     return null;
  //   }

  //   return await this.model.findOne(filter, projection, options);
  // }

  // public async findMany(
  //   filter: FilterQuery<MessageDocument>,
  //   projection?: ProjectionType<MessageDocument> | null | undefined,
  //   options?: QueryOptions<MessageDocument> | null | undefined,
  // ) {
  //   return await this.model.find(filter, projection, options);
  // }

  // public async updateOneById(
  //   _id: Types.ObjectId,
  //   updateQuery: UpdateQuery<MessageDocument>,
  // ): Promise<boolean> {
  //   const updateResult = await this.model.updateOne({ _id }, updateQuery);

  //   return !!updateResult.modifiedCount;
  // }

  // //   public format(message: Message) {
  // //     const { user, ...messagePart } = message;
  // //     const formattedUser = this.userModel.formatInMessage(user);

  // //     return { ...messagePart, user: formattedUser };
  // //   }

  // //   public formats(messages: Message[]) {
  // //     return messages.map((item) => {
  // //       return this.format(item);
  // //     });
  // //   }
}
