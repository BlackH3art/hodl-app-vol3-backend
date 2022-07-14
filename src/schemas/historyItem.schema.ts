import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HistoryDocument = HistoryItem & Document;


@Schema()
export class HistoryItem extends Document {
  @Prop()
  ticker: string;

  @Prop()
  type: "buy" | "sell";

  @Prop()
  sellingPrice: number | null;

  @Prop()
  entryPrice: number;

  @Prop()
  quantity: number;

  @Prop()
  sellingQuantity: number | null;

  @Prop()
  invested: number;

  @Prop()
  gain: number;
  
  @Prop({ type: Date })
  closeDate: Date;

  @Prop({ type: Date })
  openDate: Date;

  @Prop({ type: Date })
  createdAt: Date;

}

export const HistoryItemSchema = SchemaFactory.createForClass(HistoryItem);