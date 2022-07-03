import { Test, TestingModule } from '@nestjs/testing';
import { FetchCmcService } from './fetch-cmc.service';

describe('FetchCmcService', () => {
  let service: FetchCmcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FetchCmcService],
    }).compile();

    service = module.get<FetchCmcService>(FetchCmcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
