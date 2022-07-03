import { HttpService } from '@nestjs/axios';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CoinDetailsItem } from 'src/schemas/coinDetailsItem';
import { baseUrl } from 'src/utils/constants';

@Injectable()
export class FetchCmcService {

  constructor(
    @Inject(HttpService) private httpService: HttpService,
    @InjectModel(CoinDetailsItem.name) private coinDetailsModel: Model<CoinDetailsItem>
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
  async getCoinData(ticker: string): Promise<CoinDetailsItem | boolean> {
    
    try {

      const coinFromDB = await this.coinDetailsModel.findOne({ symbol: ticker });

      if(coinFromDB) {
        return coinFromDB;
      } else {

        const { data } = await this.httpService.axiosRef.get(`${baseUrl}/cryptocurrency/info`, this.createRequestObject(ticker));
        
        const { name, symbol, logo } = data.data[ticker];
        const newCoinDetailsItem: CoinDetailsItem = {
          name,
          symbol,
          logo,
        }

        return await this.coinDetailsModel.create(newCoinDetailsItem);
      }
      
    } catch (error) {
      // throw new BadRequestException(error, "There's no such coin.");
      return false;
    }
    
  }
}
