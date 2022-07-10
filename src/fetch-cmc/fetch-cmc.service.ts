import { HttpService } from '@nestjs/axios';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Model } from 'mongoose';
import { CoinDetailsDocument, CoinDetailsItem } from 'src/schemas/coinDetailsItem';
import { User, UserDocument } from 'src/schemas/user.schema';
import { baseUrl } from 'src/utils/constants';
import { CoinDataInterface } from 'src/interfaces/CoinDataInterface';

@Injectable()
export class FetchCmcService {

  constructor(
    @Inject(HttpService) private httpService: HttpService,
    @InjectModel(CoinDetailsItem.name) private coinDetailsModel: Model<CoinDetailsItem>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}


  private createRequestObject(ticker: string) {
    return { 
      params: {
        symbol: `${ticker}`
      },
      headers: {
        'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
      },
    }
  }
  

  // fetch only single coin data
  async getSingleCoinData(res: Response, tickerParam: string): Promise<any> {

    const ticker = tickerParam.toUpperCase();
    
    try {

      const coinFromDB: CoinDetailsDocument = await this.coinDetailsModel.findOne({ symbol: ticker });

      if(coinFromDB) {

        const { data: prices } = await this.httpService.axiosRef.get(`${baseUrl}/cryptocurrency/quotes/latest`, this.createRequestObject(ticker));


        const { name, symbol, logo } = coinFromDB;
        const { price: currentPrice, "percent_change_1h": change1h, "percent_change_24h": change24h, "percent_change_7d": change7d} = prices.data[ticker].quote.USD;

        const coinData: CoinDataInterface = {
          name,
          ticker: symbol,
          logo,
          currentPrice,
          change1h,
          change24h,
          change7d,
        }

        return res.status(200).json(coinData);

      } else {

        const { data: details } = await this.httpService.axiosRef.get(`${baseUrl}/cryptocurrency/info`, this.createRequestObject(ticker));
        const { data: prices } = await this.httpService.axiosRef.get(`${baseUrl}/cryptocurrency/quotes/latest`, this.createRequestObject(ticker));

        
        const { name, symbol, logo } = details.data[ticker];
        const { price: currentPrice, "percent_change_1h": change1h, "percent_change_24h": change24h, "percent_change_7d": change7d} = prices.data[ticker].quote.USD;

        const newCoinDetailsItem: CoinDetailsItem = {
          name,
          symbol,
          logo,
        }
        await this.coinDetailsModel.create(newCoinDetailsItem);

        const coinData: CoinDataInterface = {
          name,
          ticker: symbol,
          logo,
          currentPrice,
          change1h,
          change24h,
          change7d,
        }

        return res.status(200).json(coinData);
      }
      
    } catch (error) {
      console.log("error fetching single coin");
      console.log(error.message);
      res.status(500).json({ ok: false, msg: "Something went wrong"});
    }
    
  }


  async getManyCoinsData(res: Response, user: UserDocument) {

    try {

      if(!Types.ObjectId.isValid(user._id)) return res.status(400).json({ ok: false, msg: "Incorrect user ID" });
  
      const authUser: UserDocument = await this.userModel.findById(user._id);

      // array for history items tickers
      const historyItemsTickersArray: string[] = [];
      
      // push ticker from each history item
      authUser.history.forEach(item => {
        historyItemsTickersArray.push(item.ticker.toUpperCase());
      });

      // make sure each string in array is uniq
      const uniqTickersArray: string[] = historyItemsTickersArray.filter((value, index, self) => self.indexOf(value) === index);

      // stringify array with uniq tickers to make CMC API call
      const tickersToFetch: string = uniqTickersArray.toString();
      
      // get details: name, symbol, logo
      const { data: details } = await this.httpService.axiosRef.get(`${baseUrl}/cryptocurrency/info`, this.createRequestObject(tickersToFetch));
      // get prices: current, 1h, 24h, 7d cahnge
      const { data: prices } = await this.httpService.axiosRef.get(`${baseUrl}/cryptocurrency/quotes/latest`, this.createRequestObject(tickersToFetch));

      const coinsDataArray: CoinDataInterface[] = [];

      for(const key in details.data) {

        const { name, symbol: ticker, logo } = details.data[key];
        const { price: currentPrice, "percent_change_1h": change1h, "percent_change_24h": change24h, "percent_change_7d": change7d} = prices.data[key].quote.USD;

        const coinData: CoinDataInterface = {
          name,
          ticker,
          logo,
          currentPrice,
          change1h,
          change24h,
          change7d,
        }

        coinsDataArray.push(coinData);
      }

      res.status(200).json(coinsDataArray);
      
    } catch (error) {
      console.log("error fetching many coins");
      console.log(error.message);
      res.status(500).json({ ok: false, msg: "Something went wrong"});
    }
  }
}
