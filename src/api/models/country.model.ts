import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ERROR_MESSAGES } from '../../commons/messages';
import { CommonModel } from './bases/common-model';
import { Country, CountryDocument } from './schemas';

@Injectable()
export class CountryModel extends CommonModel<Country> {
  constructor(
    @InjectModel(Country.name)
    readonly model: Model<CountryDocument>,
  ) {
    super();
    this.conflictMessage = ERROR_MESSAGES['Country already exists'];
    this.notFoundMessage = ERROR_MESSAGES['Country does not exist'];
  }
}
