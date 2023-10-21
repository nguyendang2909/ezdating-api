import { ApiService } from './api.service';

export class ApiCursorStringService extends ApiService {
  protected getCursor(_cursor: string): string {
    const cursor = this.decodeToString(_cursor);

    return cursor;
  }
}
