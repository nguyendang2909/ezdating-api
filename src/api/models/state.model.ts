import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ERROR_MESSAGES } from '../../commons/messages';
import { CommonModel } from './bases/common-model';
import { State, StateDocument } from './schemas';

@Injectable()
export class StateModel extends CommonModel<State> {
  constructor(
    @InjectModel(State.name)
    readonly model: Model<StateDocument>,
  ) {
    super();
    this.conflictMessage = ERROR_MESSAGES['State already exists'];
    this.notFoundMessage = ERROR_MESSAGES['State does not exist'];
  }
}
