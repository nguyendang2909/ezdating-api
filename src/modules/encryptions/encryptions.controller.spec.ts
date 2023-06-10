import { Test, TestingModule } from '@nestjs/testing';
import { EncryptionsController } from './encryptions.controller';
import { EncryptionsService } from './encryptions.util';

describe('EncryptionsController', () => {
  let controller: EncryptionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EncryptionsController],
      providers: [EncryptionsService],
    }).compile();

    controller = module.get<EncryptionsController>(EncryptionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
