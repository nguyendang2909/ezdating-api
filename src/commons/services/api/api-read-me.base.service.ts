import { ClientData } from '../../../api/auth/auth.type';
import { ApiBaseService } from './api.base.service';

export class ApiReadMeService<Response> extends ApiBaseService {
  public async findOne(client: ClientData): Promise<Response> {
    return await this.throwNotImplemented();
  }
}
