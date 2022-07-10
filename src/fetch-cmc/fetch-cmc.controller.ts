import { Controller, Get, Inject, Param, Res, UseGuards } from '@nestjs/common';
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


  @Get('/coin/:ticker')
  @UseGuards(AuthGuard('jwt'))
  singleCoinData(
    @Param('ticker') ticker: string,
    @Res() res: Response
  ): Promise<any> {
    return this.fetchCmc.getSingleCoinData(res, ticker);
  }


  @Get('coins')
  @UseGuards(AuthGuard('jwt'))
  manyCoinsData(
    @UserDecorator() user: UserDocument,
    @Res() res: Response
  ): Promise<any> {
    return this.fetchCmc.getManyCoinsData(res, user);
  }

}
