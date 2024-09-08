import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DayDocument = HydratedDocument<Day>;

@Schema()
export class Day {
    @Prop()
    day: Date;
    @Prop()
    day_number: string;
}

export const DaySchema = SchemaFactory.createForClass(Day);
