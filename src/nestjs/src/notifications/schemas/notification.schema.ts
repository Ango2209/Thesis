import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'Patient' })
  patientId: Types.ObjectId;
  @Prop({ required: true, type: Types.ObjectId, ref: 'Doctor' })
  doctorId: Types.ObjectId;
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  isRead: boolean;
  @Prop({ required: true })
  content: string;
  @Prop({ required: true })
  date: Date;

}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
