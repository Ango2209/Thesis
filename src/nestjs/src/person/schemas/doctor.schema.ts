import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Person, PersonSchema } from './person.schemas';

export type DoctorDocument = HydratedDocument<Doctor>;

@Schema()
export class Doctor extends Person {
  @Prop({ default: false })
  is_accepted: boolean;
  @Prop({ default: false })
  deleted: boolean;
  
  @Prop()
  work_type: string;

  @Prop({ unique: true })
  doctor_id: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Patient' }], default: [] })
  patients: Types.ObjectId[];

  @Prop()
  specialized: string;
  
  @Prop()
  year_of_experience: number;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
DoctorSchema.add(PersonSchema);
