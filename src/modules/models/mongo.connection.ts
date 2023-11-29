import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Injectable()
export class MongoConnection {
  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async withTransaction<T>(func: () => Promise<T>): Promise<T> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const result = await func();
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
