import { Injectable } from '@nestjs/common';

import { UserRelationshipStatusEntity } from './relationship-status-entity.service';

@Injectable()
export class UserRelationshipStatusesService {
  constructor(
    private readonly userRelationshipStatusEntity: UserRelationshipStatusEntity,
  ) {}

  public async findAll() {
    const findResult = await this.userRelationshipStatusEntity.findAll({});

    return findResult;
  }

  public async findOneOrFailById(id: number) {
    return await this.userRelationshipStatusEntity.findOneOrFail({
      where: {
        id,
      },
    });
  }
}
