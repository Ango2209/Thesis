import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ShiftDocument = HydratedDocument<Shift>;

@Schema()
export class Shift {
    @Prop()
    name: string;
    @Prop()
    desc: string;
    @Prop()
    time_start: Date;
    @Prop()
    time_end: Date;
}

export const ShiftSchema = SchemaFactory.createForClass(Shift);
