import { Injectable } from '@nestjs/common';

import { JobEntity } from './job-entity.service';

@Injectable()
export class JobsService {
  constructor(private readonly jobEntity: JobEntity) {}

  public async findAll() {
    const findResult = await this.jobEntity.findAll({});

    return findResult;
  }

  public async findOneOrFailById(id: number) {
    return await this.jobEntity.findOneOrFail({
      where: {
        id,
      },
    });
  }
}
