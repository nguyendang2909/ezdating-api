import { Model } from 'mongoose';
import { CommonModel } from '../bases';
import { TrashMessage, TrashMessageDocument } from '../schemas';
export declare class TrashMessageModel extends CommonModel<TrashMessage> {
    readonly model: Model<TrashMessageDocument>;
    constructor(model: Model<TrashMessageDocument>);
}
