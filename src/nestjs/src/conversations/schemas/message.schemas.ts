import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
    @Prop()
    content: string;
    @Prop([String])
    images: string[];
    @Prop()
    patient_sender_id;
    @Prop()
    doctor_sender_id;
    @Prop()
    conversation_id;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
