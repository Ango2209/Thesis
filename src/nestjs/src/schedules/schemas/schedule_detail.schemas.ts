import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ScheduleDetailDocument = HydratedDocument<ScheduleDetail>;

@Schema()
export class ScheduleDetail {
    @Prop()
    content_exam: string;
    @Prop()
    result_exam: string;
    @Prop()
    day_exam: Date;
    @Prop()
    status: boolean;
    @Prop()
    is_exam: boolean;
    @Prop()
    patient_id: string;
    @Prop()
    schedule_id: number
}

export const ScheduleDetailSchema = SchemaFactory.createForClass(ScheduleDetail);
