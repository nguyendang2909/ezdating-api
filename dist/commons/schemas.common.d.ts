import { Types } from 'mongoose';
export declare class CommonSchema {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare class CommonEmbeddedSchema {
    _id: Types.ObjectId;
}
