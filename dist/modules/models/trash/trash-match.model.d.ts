import { Model } from 'mongoose';
import { CommonModel } from '../bases';
import { TrashMatch, TrashMatchDocument } from '../schemas';
export declare class TrashMatchModel extends CommonModel<TrashMatch> {
    readonly model: Model<TrashMatchDocument>;
    constructor(model: Model<TrashMatchDocument>);
}
