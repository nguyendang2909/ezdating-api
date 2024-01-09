import { Injectable } from '@nestjs/common';

import { StateModel } from '../../models';
import { FindAllStatesByCountryIso2Query } from './dto';

@Injectable()
export class StatesService {
  constructor(private readonly stateModel: StateModel) {}

  public async findAllByCountryIso2(
    queryParams: FindAllStatesByCountryIso2Query,
  ) {
    return await this.stateModel.findMany({
      'country.iso2': queryParams.countryIso2,
    });
  }

  public async findOneOrFail(iso2: string) {
    return await this.stateModel.findOneOrFail({
      where: {
        iso2,
      },
    });
  }
}
