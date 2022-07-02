import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';
import { Model } from 'mongoose';
import { TransactionBodyInterface } from 'src/interfaces/TransactionInterface';
import { HistoryItem } from 'src/schemas/historyItem.schema';
import { TransactionItem } from 'src/schemas/transactionItem.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class TransactionService {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(TransactionItem.name) private transactionModel: Model<TransactionItem>,
    @InjectModel(HistoryItem.name) private historyModel: Model<HistoryItem>,
  ) {}


  async add(transactionBody: TransactionBodyInterface, req: Request, res: Response) {

    console.log('cookies --> ', req.cookies);
    
  }
}
