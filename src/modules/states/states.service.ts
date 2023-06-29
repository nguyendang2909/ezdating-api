import { Injectable } from '@nestjs/common';

import { StateEntity } from './state-entity.service';

@Injectable()
export class StatesService {
  constructor(private readonly stateEntity: StateEntity) {}
  public async findAll() {
    return await this.stateEntity.findAll({});
  }

  public async findOneOrFail(iso2: string) {
    return await this.stateEntity.findOneOrFail({
      where: {
        iso2,
      },
    });
  }
}
