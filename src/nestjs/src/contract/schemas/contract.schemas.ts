import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ContractDocument = HydratedDocument<Contract>;

@Schema()
export class Contract {
    @Prop()

    @Prop()
    patient_id: string;
    @Prop()
    doctor_id: string;
}

export const ContractSchema = SchemaFactory.createForClass(Contract);
