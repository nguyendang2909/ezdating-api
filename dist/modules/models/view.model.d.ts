import { Model } from 'mongoose';
import { CommonModel } from './bases/common-model';
import { View, ViewDocument } from './schemas/view.schema';
export declare class ViewModel extends CommonModel<View> {
    readonly model: Model<ViewDocument>;
    constructor(model: Model<ViewDocument>);
}
