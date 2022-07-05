import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TransactionDocument = TransactionItem & Document;


@Schema()
export class TransactionItem extends Document {
  @Prop()
  ticker: string;

  @Prop()
  type: "buy" | "sell";

  @Prop()
  quantity: number;

  @Prop()
  entryPrice: number;

  @Prop({ type: Date, default: new Date() })
  openDate: Date;

  @Prop()
  historyItemID: string;

  @Prop({ type: Boolean})
  open: boolean;
}

export const TransactionItemSchema = SchemaFactory.createForClass(TransactionItem);