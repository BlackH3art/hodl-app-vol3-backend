import { Controller, Get, Inject, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { UserDecorator } from 'src/decorators/user.decorator';
import { UserDocument } from 'src/schemas/user.schema';
import { FetchCmcService } from './fetch-cmc.service';

@Controller('fetch')
export class FetchCmcController {

  constructor(
    @Inject(FetchCmcService) private fetchCmc: FetchCmcService
  ) {}


  @Get('/coin/data')
  getCoinData(): Promise<any> {
    return this.fetchCmc.getSingleCoinData('SOL');
  }


  @Get('coins')
  @UseGuards(AuthGuard('jwt'))
  getCoinsDetails(
    @UserDecorator() user: UserDocument,
    @Res() res: Response
  ): Promise<any> {
    return this.fetchCmc.getManyCoinsData(res, user);
  }

}
