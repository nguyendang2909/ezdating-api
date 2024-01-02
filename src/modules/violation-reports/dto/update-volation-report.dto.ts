import { PartialType } from '@nestjs/swagger';
import { CreateVolationReportDto } from './create-volation-report.dto';

export class UpdateVolationReportDto extends PartialType(CreateVolationReportDto) {}
