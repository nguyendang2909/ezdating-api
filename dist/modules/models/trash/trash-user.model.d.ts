import { Model } from 'mongoose';
import { CommonModel } from '../bases';
import { TrashUser, TrashUserDocument } from '../schemas';
export declare class TrashUserModel extends CommonModel<TrashUser> {
    readonly model: Model<TrashUserDocument>;
    constructor(model: Model<TrashUserDocument>);
}
