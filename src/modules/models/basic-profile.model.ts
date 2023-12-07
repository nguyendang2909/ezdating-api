import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Types } from 'mongoose';

import { ERROR_MESSAGES } from '../../commons/messages/error-messages.constant';
import { CommonModel } from './bases/common-model';
import { BasicProfile, BasicProfileDocument } from './schemas';
import { Profile } from './schemas/profile.schema';

@Injectable()
export class BasicProfileModel extends CommonModel<BasicProfile> {
  constructor(
    @InjectModel(BasicProfile.name) readonly model: Model<BasicProfileDocument>,
  ) {
    super();
    this.conflictMessage = ERROR_MESSAGES['Basic profile already exists'];
    this.notFoundMessage = ERROR_MESSAGES['Basic profile does not exist'];
  }

  async createOne(doc: Partial<Profile> & { _id: Types.ObjectId }) {
    const createResult = await this.model.create(doc);
    return createResult.toJSON();
  }
}
