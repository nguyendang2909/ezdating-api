import { ClientData } from '../../../api/auth/auth.type';
import { APP_CONFIG } from '../../../app.config';
import { Pagination } from '../../../types';
import { ApiBaseService } from './api.base.service';

export class ApiReadService<
  Entity extends object,
  QueryParams = Record<string, any>,
> extends ApiBaseService {
  protected limitRecordsPerQuery = APP_CONFIG.PAGINATION_LIMIT.DEFAULT;

  public async findOneById(id: string, client: ClientData): Promise<Entity> {
    return await this.throwNotImplemented();
  }

  public async findMany(
    queryParams: QueryParams,
    client: ClientData | undefined,
  ): Promise<Entity[]> {
    return await this.throwNotImplemented();
  }

  public getPagination(data: unknown[]): Pagination {
    throw this.throwNotImplemented();
  }
}
