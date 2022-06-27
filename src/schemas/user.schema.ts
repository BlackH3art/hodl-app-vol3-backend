import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { HistoryItem, HistoryItemSchema } from './historyItem.schema';
import { TransactionItem, TransactionItemSchema } from './transactionItem.schema';

export type UserDocument = User & Document;

type UserData = {
  email: string;
  password: string;
}


@Schema()
export class User {
  @Prop()
  data: UserData;

  @Prop()
  invested: number;

  @Prop({ type: TransactionItemSchema })
  transactions: TransactionItem[];

  @Prop({ type: HistoryItemSchema })
  history: HistoryItem[];
}

export const UserSchema = SchemaFactory.createForClass(User);