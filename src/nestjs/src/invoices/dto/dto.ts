import { Types } from 'mongoose';

export class CreateInvoiceDto {
  invoiceId?: string;
  patientId?: string;
  customerName?: string;
  customerPhone?: string;
  userId: Types.ObjectId;
  invoiceType: 'medicine' | 'service' | 'booked';
  medicines?: {
    medicineId: Types.ObjectId;
    quantity: number;
    dosage?: string;
    instraction?: string;
    unitPrice: number;
    totalPrice?: number;
  }[];
  services?: {
    serviceId: Types.ObjectId;
    unitPrice: number;
    totalPrice: number;
  }[];
  totalAmount?: number;
  status: 'paid' | 'awaiting transfer';
  paymentMethod: 'cash' | 'transfer';
}
