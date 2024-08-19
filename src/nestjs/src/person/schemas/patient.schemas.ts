import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';
import { Person, PersonSchema } from './person.schemas';

export type PatientDocument = HydratedDocument<Patient>;

@Schema()
export class Patient extends Person {
  @Prop()
  blood: string;
  @Prop()
  anamesis: number;
  @Prop()
  deleted: number;
  @Prop()
  person_id: string;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
PatientSchema.add(PersonSchema);
