import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ScheduleDocument = HydratedDocument<Schedule>;

@Schema()
export class Schedule {
    @Prop()
    time_per_conversation: number;
    @Prop()
    fee: number;
    @Prop()
    shift_id: string;
    @Prop()
    day_id: string;
    @Prop()
    doctor_id: string;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
