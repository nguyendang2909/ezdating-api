import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class SchedulesService {
  private readonly logger = new Logger(SchedulesService.name);

  //   https://docs.nestjs.com/techniques/task-scheduling
  @Cron('45 * * * * *')
  handleCron() {
    this.logger.debug('Called when the current second is 45');
  }
}
