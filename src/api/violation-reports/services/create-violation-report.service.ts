import { Injectable } from '@nestjs/common';

import { ApiCreateBaseService } from '../../../commons/services/api/api-create.base.service';
import { ClientData } from '../../auth/auth.type';
import { ViolationReport } from '../../../models/schemas/violation-report.schema';
import { ViolationReportModel } from '../../../models/violation-report.model';
import { CreateVolationReportDto } from '../dto/create-volation-report.dto';

@Injectable()
export class CreateViolationReportService extends ApiCreateBaseService {
  constructor(private readonly violationReportModel: ViolationReportModel) {
    super();
  }

  public async run(
    payload: CreateVolationReportDto,
    client: ClientData,
  ): Promise<ViolationReport> {
    const { _currentUserId } = this.getClient(client);
    return await this.violationReportModel.createOne({
      _userId: _currentUserId,
      _targetUserId: this.getObjectId(payload.targetUserId),
      reason: payload.reason,
    });
  }
}
