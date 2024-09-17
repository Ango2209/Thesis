import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Doctor } from 'src/person/schemas/doctor.schema';
import { Patient } from 'src/person/schemas/patient.schemas';

export type AppointmentDocument = HydratedDocument<Appointment>;

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' })
  doctor: Doctor;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' })
  patient: Patient;
  @Prop({ type: String })
  purpose_visit: string;
  @Prop({ required: true })
  date_of_visit: Date;
  @Prop({ required: true })
  start_time: string;
  @Prop({ type: Boolean, default: false })
  isExamined: boolean;
  @Prop({ default: 'booked' })
  status: string;
  @Prop({ type: String })
  description: string;
  @Prop({ type: String })
  specialized: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
