import { Module } from '@nestjs/common';

import { CreateViolationReportService } from './services/create-violation-report.service';
import { ViolationReportsController } from './volation-reports.controller';

@Module({
  controllers: [ViolationReportsController],
  providers: [CreateViolationReportService],
})
export class ViolationReportsModule {}
