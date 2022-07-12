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


  async delete(id: string, res: Response, user: UserDocument) {

    try {

      if(!Types.ObjectId.isValid(user._id)) return res.status(400).json({ ok: false, msg: "Incorrect user ID" });
      if(!Types.ObjectId.isValid(id)) return res.status(400).json({ ok: false, msg: "Incorrect transaction ID" });

      const authUser: UserDocument = await this.userModel.findById(user._id);

      const transactionToDelete = authUser.transactions.id(id);
      if(!transactionToDelete) return res.status(404).json({ ok: false, msg: "Transaction not found"})
      

      await authUser.history.id(transactionToDelete.historyItemID).remove();
      await transactionToDelete.remove();
      await authUser.save();

      res.status(200).json({ ok: true, msg: "Transaction deleted"});

      
    } catch (error) {
      console.log('Error deleting');
      console.log(error.message);
      res.status(500).json({ ok: false, msg: "Something went wrong"})
    }
  }


  async edit(transactionBody: TransactionBodyInterface, id: string, res: Response, user: UserDocument) {
    
    try {

      const { ticker, type, quantity, price, date } = transactionBody;
      
      
      if(!Types.ObjectId.isValid(user._id)) return res.status(400).json({ ok: false, msg: "Incorrect user ID" });
      if(!Types.ObjectId.isValid(id)) return res.status(400).json({ ok: false, msg: "Incorrect transaction ID" });

      const authUser: UserDocument = await this.userModel.findById(user._id);

      const transactionToEdit = authUser.transactions.id(id);
      const historyItemToEdit = authUser.history.id(transactionToEdit.historyItemID);

      transactionToEdit.set({
        ...transactionToEdit,
        ticker: ticker,
        type: type,
        quantity: quantity,
        entryPrice: price,
        openDate: date,
      });

      historyItemToEdit.set({
        ...historyItemToEdit,
        ticker: ticker,
        type: type,
        quantity: quantity,
        entryPrice: price,
        openDate: date,
      });

      await authUser.save();


      res.status(200).json({ ok: true, msg: "Transaction updated"});
      
    } catch (error) {
      console.log('Error editing');
      console.log(error.message);
      res.status(500).json({ ok: false, msg: "Something went wrong"})
    }
  }


  async sell(transactionBody: TransactionBodyInterface, id: string, res: Response, user: UserDocument) {

    try {

      const { ticker, type, quantity, price, date } = transactionBody;
      
      
      if(!Types.ObjectId.isValid(user._id)) return res.status(400).json({ ok: false, msg: "Incorrect user ID" });
      if(!Types.ObjectId.isValid(id)) return res.status(400).json({ ok: false, msg: "Incorrect transaction ID" });

      const authUser: UserDocument = await this.userModel.findById(user._id);

      const transactionToSell = authUser.transactions.id(id);


      if(ticker !== transactionToSell.ticker) res.status(200).json({ ok: false, msg: "Cannot sell different coin" });
      if(type !== "sell") res.status(200).json({ ok: false, msg: "Incorrect type for selling" });
      if(quantity > transactionToSell.quantity) res.status(200).json({ ok: false, msg: "Cannot sell more than position amount" });



      // two scenarios
      // 1. sellingQuantity is part of quantity
      // 2. sellingQuantity is equal to quantity

      if(transactionToSell.quantity - quantity !== 0) {

        transactionToSell.set({
          ...transactionToSell,
          quantity: transactionToSell.quantity - quantity,
        });

      } else if (transactionToSell.quantity - quantity === 0) {

        transactionToSell.set({
          ...transactionToSell,
          quantity: transactionToSell.quantity - quantity,
          open: false,
        });
      }


      // transaction edited
      // create history item based on transaction


      const sellHistoryItem = {
        ticker: ticker,
        type: type,
        entryPrice: transactionToSell.entryPrice,
        sellingPrice: price,
        quantity: transactionToSell.quantity,
        sellingQuantity: quantity,
        openDate: date,
        closeDate: new Date(),
        gain: (quantity * price),
        invested: transactionToSell.quantity * transactionToSell.entryPrice
      }

      const newSellHistoryItem = await this.historyModel.create(sellHistoryItem);
      authUser.history.push(newSellHistoryItem);


      await authUser.save();


      res.status(200).json({ ok: true, msg: "Transaction sold" });


      
    } catch (error) {
      console.log('Error selling transaction');
      console.log(error.message);
      res.status(500).json({ ok: false, msg: "Something went wrong"})
    }
  }


  async average(res: Response, user: UserDocument) {

    try {

      if(!Types.ObjectId.isValid(user._id)) return res.status(400).json({ ok: false, msg: "Incorrect user ID" });

      const averageTransactions = await this.userModel.aggregate([
        {
          $match: {
            _id: user._id
          }
        }, 
        {
          $unwind: {
            path: '$transactions'
          }
        }, 
        {
          $match: {
            'transactions.open': true
          }
        }, 
        {
          $group: {
            _id: '$transactions.ticker', 
            averagePrice: {
              $avg: '$transactions.entryPrice'
            }, 
            quantitySum: {
              $sum: '$transactions.quantity'
            }
          }
        }
      ]);


      res.status(200).json(averageTransactions);
      
    } catch (error) {
      console.log("error average transactions");
      console.log(error.message);
      res.status(500).json({ ok: false, msg: "Something went wrong"});
    }
  }


  async all(res: Response, user: UserDocument) {

    try {
      if(!Types.ObjectId.isValid(user._id)) return res.status(400).json({ ok: false, msg: "Incorrect user ID" });
  
      const authUser: UserDocument = await this.userModel.findById(user._id);

      res.status(200).json(authUser.transactions);
      
    } catch (error) {
      console.log("error getting transactions");
      console.log(error.message);
      res.status(500).json({ ok: false, msg: "Something went wrong"});
    }

  }


  async history(res: Response, user: UserDocument) {
    try {
      if(!Types.ObjectId.isValid(user._id)) return res.status(400).json({ ok: false, msg: "Incorrect user ID" });
  
      const authUser: UserDocument = await this.userModel.findById(user._id);

      res.status(200).json(authUser.history);
      
    } catch (error) {
      console.log("error getting hisotry");
      console.log(error.message);
      res.status(500).json({ ok: false, msg: "Something went wrong"});
    }
  }
}
