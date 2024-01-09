import { ClientData } from '../../../api/auth/auth.type';
import { APP_CONFIG } from '../../../app.config';
import { ApiBaseService } from './api.base.service';

export class ApiFindManyBaseService extends ApiBaseService {
  protected limitRecordsPerQuery = APP_CONFIG.PAGINATION_LIMIT.DEFAULT;

  public async run(
    queryParams: Record<string, any>,
    client: ClientData,
  ): Promise<Record<string, any>[]> {
    return await this.throwNotImplemented();
  }
}
