import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
    @Prop()
    content: string;
    @Prop([String])
    images: string[];
    @Prop()
    doctor_id: string
    @Prop()
    patient_id: string
    @Prop()
    posts_id: string
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
