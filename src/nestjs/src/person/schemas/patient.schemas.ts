import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';
import { Person, PersonSchema } from './person.schemas';
import { MedicalRecord, MedicalRecordSchema } from './medical-record.schema';

export type PatientDocument = HydratedDocument<Patient>;

@Schema()
export class Patient extends Person {
  @Prop()
  blood_group: string;
  @Prop()
  anamesis: string;
  @Prop()
  deleted: number;
  @Prop({ unique: true })
  patient_id: string;

  @Prop({ type: [MedicalRecordSchema], default: [] })
  medical_records: MedicalRecord[];
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
PatientSchema.add(PersonSchema);
