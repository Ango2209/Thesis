import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type InvoiceDocument = HydratedDocument<Invoice>;

@Schema()
export class Invoice {
  @Prop({ required: true })
  invoiceId: string;
  @Prop({ required: false })
  patientId?: string;
  @Prop({})
  customerName?: string;

  @Prop({})
  customerPhone?: string;

  @Prop({ required: true, type: Types.ObjectId })
  userId?: Types.ObjectId;

  @Prop({
    required: true,
    enum: ['medicine', 'service'],
  })
  invoiceType: string;

  @Prop([
    {
      medicineId: { type: Types.ObjectId, ref: 'Medicine', required: true },
      quantity: { type: Number, required: true },
      dosage: { type: String },
      instraction: { type: String },
      unitPrice: { type: Number, required: true },
      totalPrice: { type: Number, required: true },
    },
  ])
  medicines?: {
    medicineId: Types.ObjectId;
    quantity: number;
    dosage?: string;
    instraction?: string;
    unitPrice: number;
    totalPrice: number;
  }[];

  @Prop([
    {
      serviceId: { type: Types.ObjectId, ref: 'Service', required: true },
      unitPrice: { type: Number, required: true },
      totalPrice: { type: Number, required: true },
    },
  ])
  services?: {
    serviceId: Types.ObjectId;
    unitPrice: number;
    totalPrice: number;
  }[];

  @Prop({ required: true })
  totalAmount?: number;

  @Prop({ required: true, enum: ['paid', 'awaiting transfer'] })
  status: string;
  @Prop({ required: true, enum: ['cash', 'transfer'] })
  paymentMethod: string;
  @Prop({ default: Date.now })
  createdAt: Date;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
