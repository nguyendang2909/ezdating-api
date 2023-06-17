import { Controller } from '@nestjs/common';

import { UploadFilesService } from './upload-files.service';

@Controller('upload-files')
export class UploadFilesController {
  constructor(private readonly uploadFilesService: UploadFilesService) {}
}
