import { Model } from 'mongoose';
import { CommonModel } from './bases/common-model';
import { Country, CountryDocument } from './schemas';
export declare class CountryModel extends CommonModel<Country> {
    readonly model: Model<CountryDocument>;
    constructor(model: Model<CountryDocument>);
}
