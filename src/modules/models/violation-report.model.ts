import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CommonModel } from './bases/common-model';
import {
  ViolationReport,
  ViolationReportDocument,
} from './schemas/violation-report.schema';

@Injectable()
export class ViolationReportModel extends CommonModel<ViolationReport> {
  constructor(
    @InjectModel(ViolationReport.name)
    readonly model: Model<ViolationReportDocument>,
  ) {
    super();
  }

  private readonly logger = new Logger(ViolationReportModel.name);
}
