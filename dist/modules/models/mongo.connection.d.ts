import mongoose from 'mongoose';
export declare class MongoConnection {
    private readonly connection;
    constructor(connection: mongoose.Connection);
    withTransaction<T>(func: () => Promise<T>): Promise<T>;
}
