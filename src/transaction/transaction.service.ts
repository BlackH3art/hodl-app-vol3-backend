import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Response } from 'express';
import { Model } from 'mongoose';
import { FetchCmcService } from 'src/fetch-cmc/fetch-cmc.service';
import { TransactionBodyInterface } from 'src/interfaces/TransactionInterface';
import { HistoryItem } from 'src/schemas/historyItem.schema';
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

          try {
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
            const newBuyTransaction = await this.transactionModel.create(buyTransaction);
  
            authUser.transactions.push(newBuyTransaction);
            authUser.history.push(newBuyHistoryItem);
  
            await authUser.save();
  
            res.status(200).json({ ok: true, msg: "Created transaction and history item"});
            break;


          } catch (error) {
            console.log('Error while adding transaction');
            console.log(error.message);
            res.status(500).json({ ok: false, msg: "500 - Server fault" });
          }
        

        case "sell":
          

          let sellingQuantity: number;
          let iterator: number;

          // find transactions to sell
          const filteredTransactions = authUser.transactions.filter((item) => item.ticker === ticker && item.open === true);
          if(!filteredTransactions.length) return res.status(200).json({ ok: false, msg: `${ticker} is not in your wallet` })

          // check selling quantity with sum quantity
          const quantitySum = filteredTransactions.reduce((accum: number, item: TransactionDocument) => accum + item.quantity, 0);
          if(quantitySum < quantity) return res.status(200).json({ ok: false, msg: "Selling more than you have is not allowed" });
          
          // sorted from the newest transaction
          const sortedTransactions = filteredTransactions.sort((a, b) => (+b.openDate) - (+a.openDate));
          

          sellingQuantity = quantity;
          iterator = 0;



          do {
            
            // take the newest transaction to sell from
            console.log('sorted -->' , sortedTransactions.length);
            console.log('filtered -->' , filteredTransactions.length);
            console.log('iterator -->', iterator);
            
            
            const transaction = sortedTransactions[iterator];
            console.log('transaction -->', transaction);

            // finde the transaction to sell from user document
            const transactionToUpdate = authUser.transactions.id(transaction._id);

            // Two scenarios:
            // 1. sellingQuantity >= transaction.quantity - transaction have to be closed
            // 2. sellingQuantity < transaction.quantity - transaction have to stay open
            if(sellingQuantity >= transaction.quantity) {
              console.log('sellingQuantity większe niż quantity transakcji');

              try {
                transactionToUpdate.set({
                  ...transaction,
                  open: false,
                  quantity: 0
                });
  
                const sellHistoryItem = {
                  ticker: ticker,
                  type: type,
                  entryPrice: transaction.entryPrice,
                  sellingPrice: price,
                  quantity: transaction.quantity,
                  sellingQuantity: quantity,
                  openDate: date,
                  closeDate: new Date(),
                  gain: (quantity * price) - (transaction.quantity * transaction.entryPrice),
                  invested: transaction.quantity * transaction.entryPrice
                }
                const newSellHistoryItem = await this.historyModel.create(sellHistoryItem);
  
                authUser.history.push(newSellHistoryItem);
  
                await authUser.save();
                
                // update sellingQuantity for next iteration
                sellingQuantity = sellingQuantity - transaction.quantity;
                iterator++;

                
              } catch (error) {
                console.log('Error in sellingQuantity >= quantity');
                res.status(400).json({ ok: false, msg: "Something went wrong with selling transaction" });
              }


            } else if(sellingQuantity < transaction.quantity) {
              console.log('sellingQuantity mniejsze niż quantity transakcji');

              try {
                transactionToUpdate.set({
                  ...transaction,
                  quantity: transaction.quantity - sellingQuantity
                });
  
                const sellHistoryItem = {
                  ticker: ticker,
                  type: type,
                  entryPrice: transaction.entryPrice,
                  sellingPrice: price,
                  quantity: transaction.quantity,
                  sellingQuantity: quantity,
                  openDate: date,
                  closeDate: new Date(),
                  gain: (quantity * price),
                  invested: transaction.quantity * transaction.entryPrice
                }
  
                const newSellHistoryItem = await this.historyModel.create(sellHistoryItem);
                authUser.history.push(newSellHistoryItem);
  
                await authUser.save();
  
                sellingQuantity = 0;

                res.status(200).json({ ok: true, msg: "Transaction added"})
                
              } catch (error) {
                console.log('Error in sellingQuantity >= quantity');
                res.status(400).json({ ok: false, msg: "Something went wrong with selling transaction" });
              }

            }



          } while(sellingQuantity !== 0)

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
