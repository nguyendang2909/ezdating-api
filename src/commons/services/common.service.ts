import { Logger } from '@nestjs/common';

export class CommonService {
  protected readonly logger = new Logger('Service');
}
