import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types, HydratedDocument } from 'mongoose';
import { Doctor } from './doctor.schema';
import { Appointment } from 'src/appointment/schemas/appointment.schemas';
@Schema()
export class MedicalRecord {
  @Prop()
  record_id: string;
  @Prop()
  record_date: Date;
  @Prop()
  diagnosis: string;
  @Prop()
  notes: string;
  @Prop()
  complaint: string;
  @Prop()
  treatment: string;
  @Prop()
  vital_signs: string;
  @Prop()
  prescriptions: [];
  @Prop({ default: [] })
  attachments: string[];
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' })
  appointment: Appointment;
  @Prop({ type: Types.ObjectId, ref: Doctor.name })
  doctor: Types.ObjectId; // Reference to a doctor
}

export type PatientDocument = HydratedDocument<MedicalRecord>;
export const MedicalRecordSchema = SchemaFactory.createForClass(MedicalRecord);
