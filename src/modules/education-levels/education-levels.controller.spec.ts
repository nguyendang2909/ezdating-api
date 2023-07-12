import { Test, TestingModule } from '@nestjs/testing';
import { EducationLevelsController } from './education-levels.controller';
import { EducationLevelsService } from './education-levels.service';

describe('EducationLevelsController', () => {
  let controller: EducationLevelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EducationLevelsController],
      providers: [EducationLevelsService],
    }).compile();

    controller = module.get<EducationLevelsController>(EducationLevelsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
