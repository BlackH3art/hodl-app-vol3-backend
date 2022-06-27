import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document } from 'mongoose';

export type HistoryDocument = HistoryItem & Document;


@Schema()
export class HistoryItem {
  @Prop()
  ticker: string;

  @Prop()
  type: "buy" | "sell";

  @Prop()
  sellingPrice: number;

  @Prop()
  entryPrice: number;

  @Prop()
  quantity: number;

  @Prop()
  sellingQuantity: number;

  @Prop()
  invested: number;

  @Prop()
  gain: number;
  
  @Prop({ type: Date })
  closeDate: Date;

  @Prop({ type: Date })
  openDate: Date;

}

export const HistoryItemSchema = SchemaFactory.createForClass(HistoryItem);