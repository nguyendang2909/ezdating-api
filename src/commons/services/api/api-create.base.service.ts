import { ClientData } from '../../../modules/auth/auth.type';
import { ApiBaseService } from './api.base.service';

export class ApiCreateBaseService extends ApiBaseService {
  public async run(
    payload: Record<string, any>,
    client: ClientData,
  ): Promise<Record<string, any>> {
    return await this.throwNotImplemented();
  }
}
