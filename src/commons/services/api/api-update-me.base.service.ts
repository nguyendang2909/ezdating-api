import { ClientData } from '../../../api/auth/auth.type';
import { ApiBaseService } from './api.base.service';

export class ApiWriteMeService<
  TRawDocType extends object,
  CreatePayload = object,
  UpdatePayload = object,
> extends ApiBaseService {
  public async updateOne(
    payload: UpdatePayload,
    client: ClientData,
  ): Promise<void> {
    return await this.throwNotImplemented();
  }
}
