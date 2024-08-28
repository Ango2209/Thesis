import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MedicineDocument = HydratedDocument<Medicine>;

@Schema()
export class Medicine {
  @Prop()
  name: string;
  @Prop()
  basePrice: number;
  @Prop()
  measure: string;
  @Prop()
  description: string;
  @Prop()
  avgPurchasePrice: number;
}

export const MedicineSchema = SchemaFactory.createForClass(Medicine);
