import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema()
export class Conversation {
    @Prop()
    patient_id: string;
    @Prop()
    doctor_id: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
