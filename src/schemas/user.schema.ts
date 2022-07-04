import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { HistoryDocument, HistoryItem, HistoryItemSchema } from './historyItem.schema';
import { TransactionDocument, TransactionItem, TransactionItemSchema } from './transactionItem.schema';

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
  transactions: [TransactionDocument];

  @Prop({ type: [HistoryItemSchema], default: [] })
  history: [HistoryDocument];

  @Prop({ default: null })
  currentToken: string | null;

  @Prop({ type: Boolean, default: false })
  terms: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);