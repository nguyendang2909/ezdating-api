import { Model } from 'mongoose';
import { CommonModel } from '../bases';
import { TrashProfileFilter, TrashProfileFilterDocument } from '../schemas';
export declare class TrashProfileFilterModel extends CommonModel<TrashProfileFilter> {
    readonly model: Model<TrashProfileFilterDocument>;
    constructor(model: Model<TrashProfileFilterDocument>);
}
