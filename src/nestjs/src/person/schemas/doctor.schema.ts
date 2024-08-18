import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose';

export type DoctorDocument = HydratedDocument<Doctor>;

@Schema()
export class Doctor {
    @Prop()
    is_accepted: boolean;

    @Prop()
    deleted: boolean;

    @Prop()
    work_type: string;

    @Prop()
    person_id: string;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
