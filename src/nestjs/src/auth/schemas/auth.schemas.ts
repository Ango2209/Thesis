import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuthDocument = HydratedDocument<Auth>;

@Schema()
export class Auth {
    @Prop()
    phone_number: string;
    @Prop()
    password: string
    @Prop()
    rule: string

}

export const AuthSchema = SchemaFactory.createForClass(Auth);
