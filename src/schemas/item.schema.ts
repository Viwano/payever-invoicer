import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Item extends Document {
  @Prop({
    type: Types.ObjectId,
    default: () => new Types.ObjectId(),
    auto: true,
  })
  id: Types.ObjectId;

  @Prop({ required: true })
  sku: string;

  @Prop({ required: true, min: 0 })
  qt: number;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
