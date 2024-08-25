import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PersonDocument = HydratedDocument<Person>;

@Schema({timestamps: true})
export class Person {
  @Prop()
  fullname: string;
  @Prop()
  dob: Date;
  @Prop()
  address: string;
  @Prop()
  gender: boolean;
  @Prop()
  avatar: string;
  @Prop()
  phone: string;
  @Prop()
  email: string;
}

export const PersonSchema = SchemaFactory.createForClass(Person);
