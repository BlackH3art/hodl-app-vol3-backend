import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document } from 'mongoose';

export type TransactionDocument = TransactionItem & Document;


@Schema()
export class TransactionItem {
  @Prop()
  ticker: string;

  @Prop()
  type: "buy" | "sell";

  @Prop()
  quantity: number;

  @Prop()
  entryPrice: number;

  @Prop({ type: Date })
  openDate: Date;

  @Prop()
  historyItemID: string;
}

export const TransactionItemSchema = SchemaFactory.createForClass(TransactionItem);