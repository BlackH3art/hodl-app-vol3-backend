import { Body, Controller, Inject, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { TransactionBodyInterface } from 'src/interfaces/TransactionInterface';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {

  constructor (
    @Inject(TransactionService) private transactionService: TransactionService,
  ) {}

  @Post('add')
  addTransaction(
    @Body() transactionBody: TransactionBodyInterface,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return this.transactionService.add(transactionBody, req, res);
  }

}
