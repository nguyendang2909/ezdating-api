import { Model } from 'mongoose';
import { CommonModel } from '../bases';
import { TrashProfile, TrashProfileDocument } from '../schemas';
export declare class TrashProfileModel extends CommonModel<TrashProfile> {
    readonly model: Model<TrashProfileDocument>;
    constructor(model: Model<TrashProfileDocument>);
}
