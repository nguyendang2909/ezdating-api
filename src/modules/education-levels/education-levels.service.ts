import { Injectable } from '@nestjs/common';

import { EducationLevelEntity } from './education-level-entity.service';

@Injectable()
export class EducationLevelsService {
  constructor(private readonly educationLevelEntity: EducationLevelEntity) {}

  public async findAll() {
    const findResult = await this.educationLevelEntity.findAll({});

    return findResult;
  }

  public async findOneOrFailById(id: number) {
    return await this.educationLevelEntity.findOneOrFail({
      where: {
        id,
      },
    });
  }
}
