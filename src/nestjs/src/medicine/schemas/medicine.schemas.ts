import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MedicineDocument = HydratedDocument<Medicine>;


@Schema()
export class Medicine {
    @Prop()
    name: string;
    @Prop()
    price: number;
    @Prop()
    status: string;
    @Prop()
    inStock: number;
    @Prop()
    measure: string;

}

export const MedicineSchema = SchemaFactory.createForClass(Medicine);
