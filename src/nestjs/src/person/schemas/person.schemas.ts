import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PersonDocument = HydratedDocument<Person>;

@Schema()
export class Person {
    @Prop()
    username: string;
    @Prop()
    dob: Date;
    @Prop()
    address: string;
    @Prop()
    gender: boolean;
    @Prop()
    avatar: string;
}

export const PersonSchema = SchemaFactory.createForClass(Person);
