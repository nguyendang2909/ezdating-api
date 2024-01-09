import { ClientData } from '../../../api/auth/auth.type';
import { ApiBaseService } from './api.base.service';

export class ApiUpdateBaseService extends ApiBaseService {
  public async run(
    payload: Record<string, any>,
    client: ClientData,
  ): Promise<void> {
    return await this.throwNotImplemented();
  }
}
