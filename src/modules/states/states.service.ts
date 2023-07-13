import { Injectable } from '@nestjs/common';

import { StateModel } from '../entities/state.model';

@Injectable()
export class StatesService {
  constructor(private readonly stateModel: StateModel) {}
  public async findAll() {
    return await this.stateModel.findAll({});
  }

  public async findOneOrFail(iso2: string) {
    return await this.stateModel.findOneOrFail({
      where: {
        iso2,
      },
    });
  }
}
