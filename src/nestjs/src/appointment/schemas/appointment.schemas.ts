import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Doctor } from 'src/person/schemas/doctor.schema';
import { Patient } from 'src/person/schemas/patient.schemas';

export type AppointmentDocument = HydratedDocument<Appointment>;

@Schema()
export class Appointment {
    @Prop()
    patient_name: string;
    @Prop()
    purpose_visit: string;
    @Prop()
    date_of_visit: Date;
    @Prop()
    start_time: string;
    @Prop()
    end_time: string;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' })
    doctor: Doctor;
    @Prop()
    status: string;
    @Prop()
    description: string
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }] })
    patient: Patient
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
