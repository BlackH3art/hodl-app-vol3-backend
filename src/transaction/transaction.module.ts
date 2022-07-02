import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HistoryItem, HistoryItemSchema } from 'src/schemas/historyItem.schema';
import { TransactionItem, TransactionItemSchema } from 'src/schemas/transactionItem.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: TransactionItem.name, schema: TransactionItemSchema },
      { name: HistoryItem.name, schema: HistoryItemSchema },
    ])
  ],
  controllers: [TransactionController],
  providers: [TransactionService]
})
export class TransactionModule {}
