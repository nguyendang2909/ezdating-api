import { Injectable } from '@nestjs/common';

import { JobModel } from '../entities/job.model';

@Injectable()
export class JobsService {
  constructor(private readonly jobModel: JobModel) {}

  public async findAll() {
    const findResult = await this.jobModel.findAll({});

    return findResult;
  }

  public async findOneOrFailById(id: number) {
    return await this.jobModel.findOneOrFail({
      where: {
        id,
      },
    });
  }
}
