import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TransactionModule } from './transaction/transaction.module';
import { FetchCmcModule } from './fetch-cmc/fetch-cmc.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.CONNECTION_URL),
    AuthModule,
    UserModule,
    TransactionModule,
    FetchCmcModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
