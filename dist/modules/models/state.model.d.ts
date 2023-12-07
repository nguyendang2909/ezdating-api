import { Model } from 'mongoose';
import { CommonModel } from './bases/common-model';
import { State, StateDocument } from './schemas';
export declare class StateModel extends CommonModel<State> {
    readonly model: Model<StateDocument>;
    constructor(model: Model<StateDocument>);
}
