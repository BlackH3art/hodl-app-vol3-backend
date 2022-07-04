import { Body, Controller, Inject, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { UserDecorator } from 'src/decorators/user.decorator';
import { TransactionBodyInterface } from 'src/interfaces/TransactionInterface';
import { User, UserDocument } from 'src/schemas/user.schema';
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
    @UserDecorator() user: UserDocument,
    @Res() res: Response
  ): Promise<any> {

    return this.transactionService.add(transactionBody, res, user);
  }

}
