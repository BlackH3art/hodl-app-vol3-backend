import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { UserDecorator } from 'src/decorators/user.decorator';
import { TransactionBodyInterface } from 'src/interfaces/TransactionInterface';
import { UserDocument } from 'src/schemas/user.schema';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {

  constructor (
    @Inject(TransactionService) private transactionService: TransactionService,
  ) {}

  @Get('all')
  @UseGuards(AuthGuard('jwt'))
  getTransactions(
    @UserDecorator() user: UserDocument,
    @Res() res: Response
  ): Promise<any> {
    return this.transactionService.all(res, user);
  }

  @Get('average')
  @UseGuards(AuthGuard('jwt'))
  getAverage(
    @UserDecorator() user: UserDocument,
    @Res() res: Response
  ): Promise<any> {
    return this.transactionService.average(res, user);
  }

  @Get('history')
  @UseGuards(AuthGuard('jwt'))
  getHistory(
    @UserDecorator() user: UserDocument,
    @Res() res: Response
  ): Promise<any> {
    return this.transactionService.history(res, user);
  }

  @Post('add')
  @UseGuards(AuthGuard('jwt'))
  addTransaction(
    @Body() transactionBody: TransactionBodyInterface,
    @UserDecorator() user: UserDocument,
    @Res() res: Response
  ): Promise<any> {
    return this.transactionService.add(transactionBody, res, user);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard('jwt'))
  deleteTransaction(
    @Param('id') id: string,
    @UserDecorator() user: UserDocument,
    @Res() res: Response,
  ): Promise<any> {
    return this.transactionService.delete(id, res, user);
  }

  @Patch('edit/:id')
  @UseGuards(AuthGuard('jwt'))
  editTransaction(
    @Param('id') id: string,
    @Body() transactionBody: TransactionBodyInterface,
    @UserDecorator() user: UserDocument,
    @Res() res: Response
  ): Promise<any> {
    return this.transactionService.edit(transactionBody, id, res, user);
  }
}
