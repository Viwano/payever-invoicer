import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Item extends Document {
  @Prop({ required: true })
  sku: string;

  @Prop({ required: true, min: 0 })
  qt: number;

  @Prop({ required: true, min: 0 })
  price: number;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
