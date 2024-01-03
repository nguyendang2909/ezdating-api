import { Logger } from '@nestjs/common';

const logger = new Logger('Service');

export class CommonService {
  protected readonly logger = logger;
}
