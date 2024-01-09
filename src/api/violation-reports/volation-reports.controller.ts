import { Body, Controller, Post } from '@nestjs/common';

import { Client } from '../../commons/decorators/current-user-id.decorator';
import { ClientData } from '../auth/auth.type';
import { CreateVolationReportDto } from './dto/create-volation-report.dto';
import { CreateViolationReportService } from './services/create-violation-report.service';

@Controller('violation-reports')
export class ViolationReportsController {
  constructor(private readonly createService: CreateViolationReportService) {}

  @Post()
  create(
    @Body() payload: CreateVolationReportDto,
    @Client() client: ClientData,
  ) {
    return {
      type: 'violationReport',
      data: this.createService.run(payload, client),
    };
  }
}
