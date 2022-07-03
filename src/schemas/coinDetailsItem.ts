import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CoinDetailsDocument = CoinDetailsItem & Document;


@Schema()
export class CoinDetailsItem {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  symbol: string;

  @Prop({ type: String, required: true })
  logo: string;

}

export const CoinDetailsItemSchema = SchemaFactory.createForClass(CoinDetailsItem);