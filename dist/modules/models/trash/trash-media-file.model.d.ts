import { Model } from 'mongoose';
import { CommonModel } from '../bases';
import { TrashMediaFile, TrashMediaFileDocument } from '../schemas';
export declare class TrashMediaFileModel extends CommonModel<TrashMediaFile> {
    readonly model: Model<TrashMediaFileDocument>;
    constructor(model: Model<TrashMediaFileDocument>);
}
