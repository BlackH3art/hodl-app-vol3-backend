import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { FetchCmcService } from './fetch-cmc.service';
import { FetchCmcController } from './fetch-cmc.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CoinDetailsItem, CoinDetailsItemSchema } from 'src/schemas/coinDetailsItem';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: CoinDetailsItem.name, schema: CoinDetailsItemSchema },
      { name: User.name, schema: UserSchema },
    ])
  ],
  providers: [FetchCmcService],
  controllers: [FetchCmcController],
  exports: [FetchCmcService]
})
export class FetchCmcModule {}
