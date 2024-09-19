import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';
import { Doctor } from './doctor.schema';
import { Appointment } from 'src/appointment/schemas/appointment.schemas';
@Schema()
export class MedicalRecord {
  @Prop()
  record_date: Date;
  @Prop()
  diagnosis: string;
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
  @Prop({ type: Types.ObjectId, ref: Doctor.name })
  doctor_objid: Types.ObjectId; // Reference to a doctor
  @Prop({ type: Types.ObjectId, ref: Appointment.name })
  appointment_id: Types.ObjectId; 
}

export type PatientDocument = HydratedDocument<MedicalRecord>;
export const MedicalRecordSchema = SchemaFactory.createForClass(MedicalRecord);
