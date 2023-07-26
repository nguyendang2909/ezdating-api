import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { Message } from './entities/message.entity';
import { UserModel } from './user.model';

@Injectable()
export class MessageModel {
  constructor(
    @InjectRepository(Message)
    private readonly repository: Repository<Message>,
    private readonly userModel: UserModel,
  ) {}

  public async saveOne(
    entity: Partial<Message>,
    currentUserId: string,
  ): Promise<Message> {
    return await this.repository.save({
      ...entity,
      createdBy: currentUserId,
    });
  }

  public async findOne(
    options: FindOneOptions<Message>,
  ): Promise<Message | null> {
    if (_.isEmpty(options.where)) {
      return null;
    }
    return await this.repository.findOne(options);
  }

  public async findMany(options: FindManyOptions<Message>): Promise<Message[]> {
    return await this.repository.find(options);
  }

  public async updateOneById(
    id: string,
    updateOptions: QueryDeepPartialEntity<Message>,
  ): Promise<boolean> {
    const updateResult = await this.repository.update({ id }, updateOptions);
    return !!updateResult.affected;
  }

  public format(message: Message) {
    const { user, ...messagePart } = message;
    const formattedUser = this.userModel.formatInMessage(user);

    return { ...messagePart, user: formattedUser };
  }

  public formats(messages: Message[]) {
    return messages.map((item) => {
      return this.format(item);
    });
  }
}
