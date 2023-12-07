import { Model } from 'mongoose';
import { CommonModel } from './bases/common-model';
import { Message, MessageDocument } from './schemas/message.schema';
import { UserModel } from './user.model';
export declare class MessageModel extends CommonModel<Message> {
    readonly model: Model<MessageDocument>;
    private readonly userModel;
    constructor(model: Model<MessageDocument>, userModel: UserModel);
}
