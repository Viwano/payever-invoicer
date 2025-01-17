import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Item } from './item.schema';

@Schema()
export class Invoice extends Document {
  @Prop({
    required: true,
    trim: true,
    index: true,
  })
  customer: string;

  @Prop({
    required: true,
    min: 0,
  })
  amount: number;

  @Prop({
    unique: true,
    trim: true,
  })
  reference: string;

  @Prop({
    required: true,
    default: Date.now,
  })
  date: Date;

  @Prop({ type: [Item], required: true })
  items: Item[];

  @Prop({
    required: true,
    default: false,
  })
  processed: boolean;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
