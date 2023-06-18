import { Test, TestingModule } from '@nestjs/testing';

import { UploadFilesService } from './upload-files.service';
import { UploadFilesController } from './upload-files.controller';

describe('UploadFilesController', () => {
  let controller: UploadFilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadFilesController],
      providers: [UploadFilesService],
    }).compile();

    controller = module.get<UploadFilesController>(UploadFilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
