import { Controller, Get, Inject } from '@nestjs/common';
import { FetchCmcService } from './fetch-cmc.service';

@Controller('fetch')
export class FetchCmcController {

  constructor(
    @Inject(FetchCmcService) private fetchCmc: FetchCmcService
  ) {}


  @Get('/coin/data')
  async getCoinData(): Promise<any> {
    return this.fetchCmc.getCoinData('SOL');
  }
}
