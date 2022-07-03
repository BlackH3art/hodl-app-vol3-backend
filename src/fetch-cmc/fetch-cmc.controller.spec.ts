import { Test, TestingModule } from '@nestjs/testing';
import { FetchCmcController } from './fetch-cmc.controller';

describe('FetchCmcController', () => {
  let controller: FetchCmcController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FetchCmcController],
    }).compile();

    controller = module.get<FetchCmcController>(FetchCmcController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
