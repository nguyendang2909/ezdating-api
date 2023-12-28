import { ClientData } from '../../../modules/auth/auth.type';
import { CommonModel } from '../../../modules/models';
import { ApiBaseService } from './api.base.service';

export class ApiWriteMeService<
  TRawDocType extends object,
  CreatePayload = object,
  UpdatePayload = object,
> extends ApiBaseService {
  constructor(protected readonly model: CommonModel<TRawDocType>) {
    super();
  }

  public async updateOne(
    payload: UpdatePayload,
    client: ClientData,
  ): Promise<void> {
    return await this.throwNotImplemented();
  }
}
