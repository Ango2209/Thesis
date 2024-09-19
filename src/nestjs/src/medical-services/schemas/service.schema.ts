import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ServiceDocument = HydratedDocument<Service>;

@Schema({ timestamps: true })
export class Service {
  @Prop({ type: String })
  name: string;
  @Prop({ type: Number })
  price: number;
  @Prop({ type: String })
  status: string;
  @Prop({ type: String })
  description: string;
  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
