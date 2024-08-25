import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BatchDocument = HydratedDocument<Batch>;

@Schema({ timestamps: true })
export class Batch {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Medicine' })
  medicineId: Types.ObjectId;
  @Prop({ required: true })
  batchNumber: string;
  @Prop({ required: true })
  quantity: number;
  @Prop({ required: true })
  expiryDate: Date;
  @Prop({ required: true })
  purchasePrice: number;
}

export const BatchSchema = SchemaFactory.createForClass(Batch);
