import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';
import { Model } from 'mongoose';
import { FetchCmcService } from 'src/fetch-cmc/fetch-cmc.service';
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
    @Inject(FetchCmcService) private fetchCmcService: FetchCmcService,
  ) {}


  async add(transactionBody: TransactionBodyInterface, req: Request, res: Response) {

    console.log('transaction --> ', transactionBody);
    
    try {

      const coinDetails = await this.fetchCmcService.getCoinData(transactionBody.ticker.toUpperCase());

      // jeśli nie ma coina wyśłij res i nic nie dodawaj.
      if(!coinDetails) return res.status(404).json({ ok: false, msg: "No such coin"});

      const newTransaction = {
        ...transactionBody,
        historyItemID: ''
      }
      
    } catch (error) {
      
    }
    

    return res.end();
  }
}
