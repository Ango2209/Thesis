import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RatingDocument = HydratedDocument<Rating>;

@Schema()
export class Rating {
    @Prop()
    rating: number;
    @Prop()
    content: string;
    @Prop()
    schedule_detail_id: string;
    @Prop()
    doctor_id: string;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
