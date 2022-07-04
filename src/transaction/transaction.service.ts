import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Response } from 'express';
import { Model } from 'mongoose';
import { FetchCmcService } from 'src/fetch-cmc/fetch-cmc.service';
import { TransactionBodyInterface } from 'src/interfaces/TransactionInterface';
import { HistoryDocument, HistoryItem } from 'src/schemas/historyItem.schema';
import { TransactionDocument, TransactionItem } from 'src/schemas/transactionItem.schema';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class TransactionService {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(TransactionItem.name) private transactionModel: Model<TransactionItem>,
    @InjectModel(HistoryItem.name) private historyModel: Model<HistoryItem>,
    @Inject(FetchCmcService) private fetchCmcService: FetchCmcService,
  ) {}


  async add(transactionBody: TransactionBodyInterface, res: Response, user: UserDocument) {

    
    try {

      if(!Types.ObjectId.isValid(user._id)) return res.status(400).json({ ok: false, msg: "Incorrect user ID" });

      const authUser: UserDocument = await this.userModel.findById(user._id);

      const coinDetails = await this.fetchCmcService.getCoinData(transactionBody.ticker.toUpperCase());
      if(!coinDetails) return res.status(404).json({ ok: false, msg: "No such coin"});
      
      const { ticker, price, quantity, type, date } = transactionBody;

      switch (type) {
        case "buy":
        
          const buyHistoryItem = {
            ticker: ticker,
            type: type,
            entryPrice: price,
            sellingPrice: null,
            quantity: quantity,
            sellingQuantity: null,
            openDate: date,
            closeDate: null,
            gain: null,
            invested: quantity * price
          }
          
          const newBuyHistoryItem = await this.historyModel.create(buyHistoryItem);

          const buyTransaction = {
            ticker: ticker,
            type: type,
            quantity: quantity,
            entryPrice: price,
            openDate: date,
            open: true,
            historyItemID: newBuyHistoryItem._id
          }
          const newBuyTransaction = await this.transactionModel.create(buyTransaction)

          authUser.transactions.push(newBuyTransaction);
          authUser.history.push(newBuyHistoryItem);

          await authUser.save();

          res.status(200).json({ ok: true, msg: "Created transaction and history item"});
          break;



        case "sell":

          

          break;

        default:
          break;
      }


      
    } catch (error) {
      console.log(error.message);
      console.log(error);
      
      
    }
    

    return res.end();
  }
}
