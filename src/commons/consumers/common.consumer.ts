import { Types } from 'mongoose';

export class CommonConsumer {
  public getObjectId(id: string): Types.ObjectId {
    return new Types.ObjectId(id);
  }
}
