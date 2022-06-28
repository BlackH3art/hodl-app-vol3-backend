import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { HistoryItem, HistoryItemSchema } from './historyItem.schema';
import { TransactionItem, TransactionItemSchema } from './transactionItem.schema';

export type UserDocument = User & Document;

export type UserData = {
  email: string;
  password: string;
}


@Schema()
export class User {

  @Prop({ type: {} as UserData })
  data: UserData;

  @Prop({ type: Number, default: 0})
  invested: number;

  @Prop({ type: [TransactionItemSchema], default: [] })
  transactions: [TransactionItem];

  @Prop({ type: [HistoryItemSchema], default: [] })
  history: [HistoryItem];

  @Prop({ default: null })
  currentToken: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);