import { ClientData } from '../../../api/auth/auth.type';
import { ApiBaseService } from './api.base.service';

export class ApiWriteService<
  Entity extends object,
  CreatePayload = Record<string, any>,
  UpdatePayload = Record<string, any>,
> extends ApiBaseService {
  public async createOne(
    payload: CreatePayload,
    client: ClientData | undefined,
  ): Promise<Entity> {
    return await this.throwNotImplemented();
  }

  public async updateOneById(
    id: string,
    payload: UpdatePayload,
    client: ClientData | undefined,
  ): Promise<void> {
    return await this.throwNotImplemented();
  }
}
