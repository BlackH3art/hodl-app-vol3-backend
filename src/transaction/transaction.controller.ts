import { Body, Controller, Inject, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { UserDecorator } from 'src/decorators/user.decorator';
import { TransactionBodyInterface } from 'src/interfaces/TransactionInterface';
import { User } from 'src/schemas/user.schema';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {

  constructor (
    @Inject(TransactionService) private transactionService: TransactionService,
  ) {}

  @Post('add')
  @UseGuards(AuthGuard('jwt'))
  addTransaction(
    @Body() transactionBody: TransactionBodyInterface,
    @UserDecorator() user: User,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {

    console.log('user --> ', user);
    
    return this.transactionService.add(transactionBody, req, res);
  }

}
