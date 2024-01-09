import { Injectable } from '@nestjs/common';

import { APP_CONFIG } from '../../../app.config';
import { ApiFindManyBaseService } from '../../../commons/services/api/api-find-many.base.service';
import { ProfilesUtil } from '../../../utils';
import { PaginationCursorNumberUtil } from '../../../utils/paginations/pagination-cursor-number.util';
import { ClientData } from '../../auth/auth.type';
import { Profile, ProfileFilterModel, ProfileModel } from '../../../models';
import { FakeFindManyLearningProfilesQuery } from '../dto/fake-find-many-learning-profiles';

@Injectable()
export class FakeLearningProfilesService extends ApiFindManyBaseService {
  constructor(
    protected readonly profileModel: ProfileModel,
    protected readonly profileFilterModel: ProfileFilterModel,
    protected readonly profilesUtil: ProfilesUtil,
    protected readonly paginationUtil: PaginationCursorNumberUtil,
  ) {
    super();
    this.limitRecordsPerQuery = APP_CONFIG.PAGINATION_LIMIT.NEARBY_USERS;
  }

  public async findMany(
    queryParams: FakeFindManyLearningProfilesQuery,
    client: ClientData,
  ): Promise<Profile[]> {
    const { _currentUserId } = this.getClient(client);
    const findResults = await this.profileModel.findMany(
      {
        _id: { $ne: _currentUserId },
        teachingSubject: queryParams.teachingSubject,
      },
      this.profileModel.publicFields,
      { $limit: this.limitRecordsPerQuery },
    );
    return findResults;
  }
}
