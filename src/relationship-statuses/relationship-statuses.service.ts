import { Injectable } from '@nestjs/common';

import { RelationshipStatusEntity } from './relationship-status-entity.service';

@Injectable()
export class RelationshipStatusesService {
  constructor(
    private readonly relationshipStatusEntity: RelationshipStatusEntity,
  ) {}

  public async findAll() {
    const findResult = await this.relationshipStatusEntity.findAll({});

    return findResult;
  }

  public async findOneOrFailById(id: number) {
    return await this.relationshipStatusEntity.findOneOrFail({
      where: {
        id,
      },
    });
  }
}
